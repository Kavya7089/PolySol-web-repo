"use client";

import { useState, useEffect } from "react";
import { Copy, Play, AlertTriangle, Check, Loader2, Wallet, Rocket, Code2, Zap, Terminal, ExternalLink } from "lucide-react";
import { EXAMPLE_JS, EXAMPLE_JAVA, type SourceLanguage } from "@/lib/polysol-mock";
import { BrowserProvider, ContractFactory } from "ethers";
import { motion } from "framer-motion";
import Link from 'next/link';
import Editor from "@monaco-editor/react";

export default function Playground() {
  const [language, setLanguage] = useState<SourceLanguage>("javascript");
  const [inputCode, setInputCode] = useState(EXAMPLE_JS);
  const [outputCode, setOutputCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTranspiling, setIsTranspiling] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Deployment states
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string>("");

  const [showDeployModal, setShowDeployModal] = useState(false);
  const [linterWarning, setLinterWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!outputCode) {
        setLinterWarning(null);
        return;
    }
    const wrongName = /uint256\s+(public\s+)?(name|symbol)/.test(outputCode);
    if (wrongName) {
        setLinterWarning("We detected 'name' or 'symbol' as a uint256. Did you mean to use a string? Add /** @type {string} */ or rely on JSDoc to fix this.");
    } else {
        setLinterWarning(null);
    }
  }, [outputCode]);

  const handleLanguageChange = (lang: SourceLanguage) => {
    if (lang === "javascript") {
        if (inputCode.includes("public class") || inputCode.includes("System.out.println")) {
           if (!confirm("Switching to JavaScript. Clear code?")) {
               setInputCode(EXAMPLE_JS);
           }
        } else {
             setInputCode(EXAMPLE_JS);
        }
    } else {
         setInputCode(EXAMPLE_JAVA);
    }
    setLanguage(lang);
    setOutputCode("");
    setError(null);
  };

  const handleDeployToRemix = () => {
    if (!outputCode) return;
    const base64 = btoa(outputCode);
    window.open(`https://remix.ethereum.org/?#code=${base64}&autoCompile=true`, '_blank');
  };

  const handleTranspile = async () => {
    setIsTranspiling(true);
    setError(null);
    try {
      const response = await fetch("/api/transpile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Transpilation failed");
      if (!data.output) throw new Error("Empty output received from server.");
      setOutputCode(data.output);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsTranspiling(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum === "undefined") throw new Error("Please install MetaMask");
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  };

  const deployContract = async () => {
    if (!walletAddress) { setError("Please connect your wallet first"); return; }
    if (!outputCode) { setError("Please transpile code first"); return; }
    setIsDeploying(true);
    setError(null);
    try {
      const compileRes = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: outputCode })
      });
      const compileData = await compileRes.json();
      if (!compileRes.ok) throw new Error(compileData.error || "Compilation failed");

      const { abi, bytecode } = compileData;
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      
      setDeployedAddress(address);
      setShowDeployModal(false);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDownloadHardhat = () => {
    if (!outputCode) return;
    const match = outputCode.match(/contract\s+(\w+)/);
    const contractName = match ? match[1] : "MyContract";
    const scriptContent = `
const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const Contract = await hre.ethers.getContractFactory("${contractName}");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;
    const blob = new Blob([scriptContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deploy.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="flex h-screen flex-col bg-[#09090b] text-foreground transition-colors duration-500 overflow-hidden font-sans"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#09090b] to-[#09090b] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_15px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-shadow">
                <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white">PolySol <span className="text-primary">Studio</span></h1>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Next-Gen Transpiler</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
                {walletAddress ? (
                    <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
                        <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                        {deployedAddress && <span className="ml-2 border-l border-white/10 pl-2 text-green-400 font-bold tracking-wide">DEPLOYED</span>}
                    </div>
                ) : (
                <button 
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="group flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                >
                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4 transition-transform group-hover:scale-110" />}
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
                )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 overflow-hidden p-6 gap-6">
        {/* Input Panel */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#121214] shadow-2xl relative group focus-within:ring-1 focus-within:ring-primary/40 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-white/5 bg-[#18181b] px-4 py-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5">
                        <Code2 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">Input Source</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select id="language-select" aria-label="Language selector" title="Source language" value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as SourceLanguage)}
                        className="h-8 rounded-lg bg-[#09090b] px-3 pl-2 text-xs font-medium text-slate-200 border border-white/10 focus:border-primary focus:outline-none appearance-none hover:bg-white/5 cursor-pointer min-w-[100px]"
                        >
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                           <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                         </div>
                    </div>
                    
                    <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                    <button
                    onClick={handleTranspile}
                    disabled={isTranspiling}
                    className="flex h-8 items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-4 text-xs font-bold text-white shadow-[0_4px_14px_0_rgba(var(--primary),0.39)] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group-hover/btn:shadow-lg"
                    >
                    {isTranspiling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                    TRANSPILE
                    </button>
                </div>
            </div>
            
            <div className="relative flex-1">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={inputCode}
                    onChange={(value) => setInputCode(value || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontFamily: "monospace",
                    }}
                />
            </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#121214] shadow-2xl relative group focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-white/5 bg-[#18181b] px-4 py-2">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">Artifacts</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {outputCode && (
                        <>
                            <button 
                            onClick={copyToClipboard}
                            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-[#09090b] px-3 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                            > 
                                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                            
                            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                            {walletAddress && (
                                <button
                                onClick={() => setShowDeployModal(true)}
                                className="flex h-8 items-center gap-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 px-3 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-600/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                >
                                <Rocket className="h-3.5 w-3.5" />
                                DEPLOY
                                </button>
                            )}
                            <button
                            onClick={handleDeployToRemix}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400 transition-all hover:bg-blue-500/10 hover:text-blue-300"
                            title="Open in Remix IDE"
                            >
                            <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                            <button
                            onClick={handleDownloadHardhat}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#09090b] text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                            title="Download Hardhat Deploy Script"
                            >
                                <Code2 className="h-3.5 w-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="relative flex-1 bg-[#0c0c0e]">
                {error ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                        <div className="h-16 w-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-white">Transpilation Failed</h3>
                        <div className="max-w-md rounded-lg border border-red-500/20 bg-red-950/20 p-4">
                             <p className="text-sm font-mono text-red-200/80 break-words text-left">{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {outputCode ? (
                           <Editor
                            height="100%"
                            language="java" // Using Java as fallback for C-like syntax highlighting
                            theme="vs-dark"
                            value={outputCode}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontFamily: "monospace",
                            }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-700 select-none pointer-events-none">
                                <div className="text-center">
                                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Ready to transpile</p>
                                </div>
                            </div>
                        )}

                        {linterWarning && (
                            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-yellow-500/20 bg-yellow-950/80 p-4 backdrop-blur-md animate-in slide-in-from-bottom-2 shadow-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="mt-0.5 p-1 rounded bg-yellow-500/10">
                                         <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-yellow-500 mb-1 uppercase tracking-wide">Linter Suggestion</p>
                                        <p className="text-yellow-100/80 leading-relaxed max-w-prose">{linterWarning}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {deployedAddress && (
                            <div aria-live="polite" className="absolute bottom-4 right-4 left-auto rounded-lg border border-emerald-500/20 bg-emerald-950/90 p-4 backdrop-blur-md animate-in slide-in-from-bottom-2 shadow-2xl shadow-emerald-500/10 max-w-sm">
                                <div className="flex items-start gap-4">
                                    <div className="mt-0.5 p-1 rounded bg-emerald-500/10">
                                        <Rocket className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-emerald-400 text-xs mb-1 uppercase tracking-wide">Deployment Successful</p>
                                        <div className="flex items-center gap-2 rounded bg-black/40 px-2 py-1.5 border border-white/5 group-copy cursor-pointer" onClick={() => {navigator.clipboard.writeText(deployedAddress)}}>
                                            <p className="text-emerald-100/70 text-[10px] font-mono tracking-wide truncate">{deployedAddress}</p>
                                            <Copy className="h-3 w-3 text-emerald-400/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </main>

      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md scale-100 rounded-2xl border border-white/10 bg-[#121214] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                 <Rocket className="h-6 w-6 text-primary" />
            </div>
            
            <h3 className="mb-2 text-2xl font-bold text-white text-center">Deploy Contract</h3>
            <p className="mb-8 text-sm text-slate-400 text-center max-w-[260px] mx-auto">You are about to deploy this contract to the connected network.</p>
            
            <div className="space-y-3">
                <button onClick={deployContract} disabled={isDeploying} className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 px-4 py-3.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-primary/20 transition-all">
                   {isDeploying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                   {isDeploying ? "Broadcasting Transaction..." : "Confirm & Deploy"}
                </button>
                <button onClick={() => setShowDeployModal(false)} className="w-full rounded-xl hover:bg-white/5 px-4 py-3.5 text-sm font-medium text-slate-400 transition-colors">Cancel</button>
            </div>
            </div>
        </div>
      )}
    </motion.div>
  );
}
