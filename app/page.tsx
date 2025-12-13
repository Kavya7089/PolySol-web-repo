"use client";

import { useState, useEffect } from "react";
import { Copy, Play, AlertTriangle, Check, Loader2, Wallet, Rocket, Code2, Zap, Terminal, ExternalLink } from "lucide-react";
import { EXAMPLE_JS, EXAMPLE_JAVA, type SourceLanguage } from "@/lib/polysol-mock";
import { BrowserProvider, ContractFactory } from "ethers";
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from "framer-motion";

const SplashScreen = dynamic(() => import("./components/SplashScreen"), { ssr: false });

export default function Playground() {
  const [showSplash, setShowSplash] = useState(true);
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
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      <section className="relative w-full h-72 bg-background">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-6 py-8 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white">PolySol Studio</h2>
            <p className="mt-3 text-sm text-slate-200 max-w-xl">Transpile Java/JavaScript into secure Solidity smart contracts with a single click. Develop, lint, transpile and deploy  all in one browser-based studio.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="bg-black/30 rounded-lg p-3">
                <p className="font-semibold text-sm text-white">Fast Transpilation</p>
                <p className="text-xs text-slate-300">Convert JS/Java to Solidity reliably with linting.</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="font-semibold text-sm text-white">Easy Deployment</p>
                <p className="text-xs text-slate-300">Deploy to Remix or download Hardhat script.</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="font-semibold text-sm text-white">Wallet Integration</p>
                <p className="text-xs text-slate-300">Connect MetaMask and broadcast contracts quickly.</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="font-semibold text-sm text-white">Static Checks</p>
                <p className="text-xs text-slate-300">Inline linter warnings and smart suggestions.</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-lg overflow-hidden border border-white/10">
            <video src="/GIF_Generation_for_Coding_Project.mp4" autoPlay muted loop playsInline aria-hidden="true" className="hero-video w-full h-72 object-cover" />
          </div>
        </div>
      </section>

      
      {!showSplash && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            className="flex h-screen flex-col bg-background text-foreground transition-colors duration-500"
        >
          {/* Header */}
          <header className="glass fixed top-15 left-0 right-0 z-40 flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary   to-secondary shadow-lg shadow-primary/20">
                 <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight glow-text">PolySol <span className="text-primary">Studio</span></h1>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Next-Gen Transpiler</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
                 {walletAddress ? (
                     <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                        <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        {deployedAddress && <span className="ml-2 border-l border-white/10 pl-2 text-green-400">Deployed</span>}
                     </div>
                 ) : (
                    <button 
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="group flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-secondary-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                    >
                       {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4 transition-transform group-hover:scale-110" />}
                       {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </button>
                 )}
            </div>
          </header>

          {/* Main Content */}
          <main className="mt-16 flex flex-1 overflow-hidden p-6 gap-6">
            {/* Input Panel */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl glass-panel relative group focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300">
               <div className="flex items-center justify-between border-b border-border bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                      <Code2 className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-secondary-foreground uppercase tracking-wide">Input Source</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <select id="language-select" aria-label="Language selector" title="Source language" value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as SourceLanguage)}
                        className="h-7 rounded bg-input px-2 bg-#359a985 text-xs text-secondary-foreground border border-border focus:border-primary focus:outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                      </select>
                      
                      <button
                        onClick={handleTranspile}
                        disabled={isTranspiling}
                        className="flex h-7 items-center gap-2 rounded bg-primary px-3 text-xs font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTranspiling ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
                        Transpile
                      </button>
                  </div>
               </div>
               
               <div className="relative flex-1">
                   <textarea
                     value={inputCode}
                     onChange={(e) => setInputCode(e.target.value)}
                     className="absolute inset-0 h-full w-full resize-none bg-black/20 p-5 font-mono text-sm leading-relaxed text-foreground focus:outline-none selection:bg-primary/30 placeholder:text-muted-foreground"
                     spellCheck={false}
                     placeholder="Paste your JS code here..."
                   />
               </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl glass-panel relative group focus-within:ring-1 focus-within:ring-green-500/50 transition-all duration-300">
                <div className="flex items-center justify-between border-b border-border bg-white/5 px-4 py-3">
                   <div className="flex items-center gap-3">
                      <Terminal className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-medium text-secondary-foreground uppercase tracking-wide">Solidity Artifact</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                       {outputCode && (
                           <>
                             <button 
                                onClick={copyToClipboard}
                                className="flex h-7 items-center gap-1.5 rounded border border-border bg-secondary/30 px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-white/10 hover:text-white"
                              > 
                                 {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                 {copied ? "Copied" : "Copy"}
                              </button>
                              
                              {walletAddress && (
                                  <button
                                    onClick={() => setShowDeployModal(true)}
                                    className="flex h-7 items-center gap-1.5 rounded bg-green-600/20 border border-green-500/30 px-3 text-xs font-medium text-green-400 transition-all hover:bg-green-600/30 hover:shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                                  >
                                    <Rocket className="h-3 w-3" />
                                    Deploy
                                  </button>
                              )}
                              <button
                                onClick={handleDeployToRemix}
                                className="flex h-7 items-center gap-1.5 rounded border border-blue-500/30 bg-blue-500/10 px-3 text-xs font-medium text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300"
                                title="Open in Remix IDE"
                              >
                                <ExternalLink className="h-3 w-3" />
                                To Remix
                              </button>
                              <button
                                onClick={handleDownloadHardhat}
                                className="flex h-7 items-center gap-1.5 rounded border border-border bg-secondary/30 px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-white/10 hover:text-white"
                                title="Download Hardhat Deploy Script"
                              >
                                 <Code2 className="h-3 w-3" />
                                 Script
                              </button>
                           </>
                       )}
                   </div>
                </div>

                <div className="relative flex-1 bg-black/20">
                   {error ? (
                      <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                          <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
                          <h3 className="mb-2 text-lg font-medium text-white">Transpilation Error</h3>
                          <p className="max-w-md text-sm text-slate-400">{error}</p>
                      </div>
                   ) : (
                      <>
                          <textarea
                            readOnly
                            value={outputCode}
                            className="absolute inset-0 h-full w-full resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-green-300 focus:outline-none selection:bg-green-500/20"
                            placeholder="// Solidity output will be generated here..."
                          />
                          {linterWarning && (
                              <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 backdrop-blur-md animate-in slide-in-from-bottom-2">
                                  <div className="flex items-start gap-3">
                                      <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-500 shrink-0" />
                                      <div className="text-xs">
                                          <p className="font-semibold text-yellow-500 mb-0.5">Suggestion Detected</p>
                                          <p className="text-yellow-200/80 leading-relaxed">{linterWarning}</p>
                                      </div>
                                  </div>
                              </div>
                          )}
                          {deployedAddress && (
                              <div aria-live="polite" className="absolute bottom-4 right-4 left-auto rounded-lg border border-green-500/20 bg-green-500/10 p-3 backdrop-blur-md animate-in slide-in-from-bottom-2 shadow-xl shadow-green-500/5">
                                  <div className="flex items-center gap-3">
                                      <Rocket className="h-4 w-4 text-green-400" />
                                      <div>
                                          <p className="font-semibold text-green-400 text-xs mb-0.5">Deployed Successfully</p>
                                          <p className="text-green-200/80 text-[10px] font-mono tracking-wide">{deployedAddress}</p>
                                      </div>
                                      <button aria-label="Copy deployed address" title="Copy deployed address" onClick={() => {navigator.clipboard.writeText(deployedAddress)}} className="ml-2 hover:text-white text-green-400/50 transition-colors">
                                          <Copy className="h-3 w-3" />
                                      </button>
                                  </div>
                              </div>
                          )}
                      </>
                   )}
                </div>
            </div>
          </main>

          {showDeployModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md scale-100 rounded-2xl border border-white/10 bg-[#0f0f11] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="mb-1 text-xl font-bold text-white">Deploy Smart Contract</h3>
                <p className="mb-6 text-sm text-slate-400">Review details before deploying to the network.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeployModal(false)} className="flex-1 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5">Cancel</button>
                  <button onClick={deployContract} disabled={isDeploying} className="flex-1 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-500">
                    {isDeploying ? "Broadcasting..." : "Confirm Deploy"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}






