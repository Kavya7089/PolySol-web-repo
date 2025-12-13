"use client";

import { useState, useEffect } from "react";
import { Copy, Play, AlertCircle, Check, Loader2, Wallet, Rocket, AlertTriangle, Code2, Zap, Terminal, ExternalLink } from "lucide-react";
import { EXAMPLE_JS, EXAMPLE_JAVA, type SourceLanguage } from "@/lib/polysol-mock";
import { BrowserProvider, ContractFactory } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from 'next/dynamic';

const SplashScreen = dynamic(() => import('@/components/SplashScreen'), { ssr: false });

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
    
    // Simple Linter: detecting wrong type inference
    const wrongName = /uint256\s+(public\s+)?(name|symbol)/.test(outputCode);
    if (wrongName) {
        setLinterWarning("We detected 'name' or 'symbol' as a uint256. Did you mean to use a string? Add /** @type {string} */ or rely on JSDoc to fix this.");
    } else {
        setLinterWarning(null);
    }
  }, [outputCode]);

  const handleLanguageChange = (lang: SourceLanguage) => {
    // Metric/Safety Check: Warn if switching language but code looks like the other one
    if (lang === "javascript") {
        if (inputCode.includes("public class") || inputCode.includes("System.out.println")) {
           if (!confirm("You are switching to JavaScript but the code looks like Java. Clear code?")) {
               setInputCode(EXAMPLE_JS);
           }
        } else {
             setInputCode(EXAMPLE_JS);
        }
    } else {
        // Switching to Java
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: inputCode, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transpilation failed");
      }

      if (!data.output) {
        throw new Error("Empty output received from server.");
      }

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
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to deploy contracts");
      }

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
    if (!walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    if (!outputCode) {
      setError("Please transpile code first");
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      // 1. Compile via API
      const compileRes = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: outputCode })
      });
      const compileData = await compileRes.json();
      
      if (!compileRes.ok) {
          throw new Error(compileData.error || "Compilation failed");
      }

      const { abi, bytecode } = compileData;

      // 2. Deploy using BrowserDeployer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Start deployment
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

    // specific parsing for contract name
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
    <AnimatePresence mode="wait">
        {showSplash ? (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
            <motion.div 
                key="main"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex h-screen flex-col bg-[#392f2f] text-[#e6d3a7] selection:bg-[#59a985]/30"
            >
              {/* Header */}
              <header className="glass fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between px-6 border-b border-[#e6d3a7]/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#59a985] shadow-lg shadow-[#59a985]/20">
                     <Zap className="h-6 w-6 text-[#392f2f]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-[#e6d3a7] glow-text">PolySol <span className="text-[#59a985]">Studio</span></h1>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#3a7563]">Nature Edition</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                     {walletAddress ? (
                         <div className="flex items-center gap-2 rounded-full border border-[#59a985]/30 bg-[#59a985]/10 px-3 py-1.5 text-xs font-medium text-[#59a985]">
                            <div className="h-2 w-2 rounded-full bg-[#59a985] shadow-[0_0_8px_rgba(89,169,133,0.5)]"></div>
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            {deployedAddress && <span className="ml-2 border-l border-[#e6d3a7]/10 pl-2 text-[#59a985]">Deployed</span>}
                         </div>
                     ) : (
                        <button 
                          onClick={connectWallet}
                          disabled={isConnecting}
                          className="group flex items-center gap-2 rounded-lg border border-[#e6d3a7]/10 px-4 py-2 text-xs font-medium text-[#e6d3a7] transition-all hover:border-[#59a985]/50 hover:bg-[#59a985]/10 hover:text-[#59a985] disabled:opacity-50"
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
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl glass-panel relative group focus-within:ring-1 focus-within:ring-[#59a985]/50 transition-all duration-300">
                   <div className="flex items-center justify-between border-b border-[#e6d3a7]/5 bg-[#e6d3a7]/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                          <Code2 className="h-4 w-4 text-[#59a985]" />
                          <span className="text-xs font-medium text-[#e6d3a7] uppercase tracking-wide">Input Source</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value as SourceLanguage)}
                            className="h-7 rounded bg-[#423838] px-2 text-xs text-[#e6d3a7] border border-[#e6d3a7]/10 focus:border-[#59a985] focus:outline-none"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="java">Java</option>
                          </select>
                          
                          <button
                            onClick={handleTranspile}
                            disabled={isTranspiling}
                            className="flex h-7 items-center gap-2 rounded bg-[#59a985] px-3 text-xs font-medium text-[#392f2f] shadow-lg shadow-[#59a985]/20 transition-all hover:shadow-[#59a985]/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
                         className="absolute inset-0 h-full w-full resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-[#e6d3a7] focus:outline-none selection:bg-[#59a985]/30 placeholder:text-[#a69b9b]"
                         spellCheck={false}
                         placeholder="Paste your JS code here..."
                       />
                   </div>
                </div>

                {/* Output Panel */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl glass-panel relative group focus-within:ring-1 focus-within:ring-[#59a985]/50 transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-[#e6d3a7]/5 bg-[#e6d3a7]/5 px-4 py-3">
                       <div className="flex items-center gap-3">
                          <Terminal className="h-4 w-4 text-[#59a985]" />
                          <span className="text-xs font-medium text-[#e6d3a7] uppercase tracking-wide">Solidity Artifact</span>
                       </div>
                       
                       <div className="flex items-center gap-2">
                           {outputCode && (
                               <>
                                 <button 
                                    onClick={copyToClipboard}
                                    className="flex h-7 items-center gap-1.5 rounded border border-[#e6d3a7]/10 bg-[#e6d3a7]/5 px-3 text-xs font-medium text-[#e6d3a7] transition-colors hover:bg-[#e6d3a7]/10 hover:text-white"
                                  > 
                                     {copied ? <Check className="h-3 w-3 text-[#59a985]" /> : <Copy className="h-3 w-3" />}
                                     {copied ? "Copied" : "Copy"}
                                  </button>
                                  
                                  {walletAddress && (
                                      <button
                                        onClick={() => setShowDeployModal(true)}
                                        className="flex h-7 items-center gap-1.5 rounded bg-[#59a985]/20 border border-[#59a985]/30 px-3 text-xs font-medium text-[#59a985] transition-all hover:bg-[#59a985]/30"
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
                                    className="flex h-7 items-center gap-1.5 rounded border border-[#e6d3a7]/10 bg-[#e6d3a7]/5 px-3 text-xs font-medium text-[#e6d3a7] transition-colors hover:bg-[#e6d3a7]/10 hover:text-white"
                                    title="Download Hardhat Deploy Script"
                                  >
                                     <Code2 className="h-3 w-3" />
                                     Script
                                  </button>
                               </>
                           )}
                       </div>
                    </div>

                    <div className="relative flex-1 bg-[#423838]/50">
                       {error ? (
                          <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                              </div>
                              <h3 className="mb-2 text-lg font-medium text-[#e6d3a7]">Transpilation Error</h3>
                              <p className="max-w-md text-sm text-[#a69b9b]">{error}</p>
                          </div>
                       ) : (
                          <>
                              <textarea
                                readOnly
                                value={outputCode}
                                className="absolute inset-0 h-full w-full resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-[#59a985] focus:outline-none selection:bg-[#59a985]/20"
                                placeholder="// Solidity output will be generated here..."
                              />
                              
                              {/* Linter Warning */}
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

                              {/* Deployed Address Success */}
                              {deployedAddress && (
                                  <div className="absolute bottom-4 right-4 left-auto rounded-lg border border-[#59a985]/20 bg-[#59a985]/10 p-3 backdrop-blur-md animate-in slide-in-from-bottom-2 shadow-xl shadow-green-500/5">
                                      <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#59a985]/20 text-[#59a985]">
                                             <Rocket className="h-4 w-4" />
                                          </div>
                                          <div>
                                              <p className="font-semibold text-[#59a985] text-xs mb-0.5">Deployed Successfully</p>
                                              <p className="text-[#59a985]/80 text-[10px] font-mono tracking-wide">{deployedAddress}</p>
                                          </div>
                                          <button onClick={() => {navigator.clipboard.writeText(deployedAddress)}} className="ml-2 hover:text-[#e6d3a7] text-[#59a985]/50 transition-colors">
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

              {/* Deploy Modal */}
              {showDeployModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#392f2f]/80 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="w-full max-w-md scale-100 rounded-2xl border border-[#e6d3a7]/10 bg-[#423838] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="mb-1 text-xl font-bold text-[#e6d3a7]">Deploy Smart Contract</h3>
                    <p className="mb-6 text-sm text-[#a69b9b]">Review details before deploying to the network.</p>
                    
                    <div className="mb-4 rounded-xl border border-[#e6d3a7]/5 bg-[#e6d3a7]/5 p-4">
                      <p className="mb-1 text-xs text-[#a69b9b] uppercase tracking-wider">Target Network</p>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-[#59a985]"></div>
                         <span className="text-sm font-medium text-[#e6d3a7]">Ethereum Sepolia / Localhost</span>
                      </div>
                    </div>

                    <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                      <div className="flex gap-3">
                         <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                         <p className="text-xs text-yellow-200/80 leading-relaxed">
                           <strong>Heads up:</strong> You are about to deploy a real contract. Ensure you have sufficient gas funds in your connected wallet.
                         </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeployModal(false)}
                        className="flex-1 rounded-lg border border-[#e6d3a7]/10 bg-transparent px-4 py-2.5 text-sm font-medium text-[#e6d3a7] transition-colors hover:bg-[#e6d3a7]/5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={deployContract}
                        disabled={isDeploying}
                        className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#59a985] px-4 py-2.5 text-sm font-medium text-[#392f2f] shadow-lg shadow-[#59a985]/20 transition-all hover:bg-[#59a985]/90 hover:shadow-[#59a985]/40 disabled:opacity-50"
                      >
                        {isDeploying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            broadcasting...
                          </>
                        ) : (
                          <>
                            <Rocket className="mr-2 h-4 w-4" />
                            Confirm Deploy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
        )}
    </AnimatePresence>
  );
}
