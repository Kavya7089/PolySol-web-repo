"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowRight, Code, Layers, Rocket } from "lucide-react";

const SplashScreen = dynamic(() => import("./components/SplashScreen"), { ssr: false });

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            className="flex min-h-screen flex-col bg-[#1e1e1e] text-slate-100 font-sans"
        >
          {/* Navbar */}
          <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-[#1e1e1e]/90 backdrop-blur-md px-6 lg:px-12">
             <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                   <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">PolySol <span className="text-primary">Studio</span></span>
             </div>
             
             <nav className="flex gap-6">
                <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
                <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
                <Link href="https://github.com" target="_blank" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">GitHub</Link>
             </nav>
          </header>

          <main className="flex-1 flex flex-col">
             {/* Hero Section */}
             <section className="relative flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 py-24 gap-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-[#1e1e1e] to-[#1e1e1e] z-0 pointer-events-none"></div>
                
                <div className="z-10 flex-1 max-w-2xl space-y-8 text-center lg:text-left">
                   <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                      v1.0 Now Available
                   </div>
                   
                   <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                      Use Java Logic in <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Smart Contracts</span>
                   </h1>
                   
                   <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                      Transpile your familiar Object-Oriented code directly into secure Solidity. 
                      Build, test, and deploy decentralized applications without learning a new syntax from scratch.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                      <Link href="/playground">
                        <button className="h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group">
                           Start Coding <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                      <Link href="/about">
                        <button className="h-12 px-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all flex items-center gap-2">
                           Learn More
                        </button>
                      </Link>
                   </div>

                   <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-slate-500">
                       <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"><Code className="h-4 w-4" /> Java / JS Support</span>
                       <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"><Layers className="h-4 w-4" /> EVM Compatible</span>
                   </div>
                </div>

                <div className="z-10 flex-1 w-full max-w-lg lg:max-w-xl">
                   <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#0f0f11]">
                       <video src="/GIF_Generation_for_Coding_Project.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
                   </div>
                </div>
             </section>
             
             {/* Features Grid */}
             <section className="py-24 bg-[#18181b] border-t border-white/5">
                <div className="container mx-auto px-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="p-8 rounded-2xl bg-[#1e1e1e] border border-white/5 hover:border-primary/30 transition-colors group">
                           <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                               <Code className="h-6 w-6 text-primary" />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">Familiar Syntax</h3>
                           <p className="text-slate-400 leading-relaxed">Write smart contracts using standard Java or JavaScript. No need to learn Solidity from scratch.</p>
                       </div>
                       <div className="p-8 rounded-2xl bg-[#1e1e1e] border border-white/5 hover:border-primary/30 transition-colors group">
                           <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                               <Zap className="h-6 w-6 text-primary" />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">Instant Transpilation</h3>
                           <p className="text-slate-400 leading-relaxed">Our advanced transpiler converts your OOP code into gas-optimized Solidity in milliseconds.</p>
                       </div>
                       <div className="p-8 rounded-2xl bg-[#1e1e1e] border border-white/5 hover:border-primary/30 transition-colors group">
                           <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                               <Rocket className="h-6 w-6 text-primary" />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">One-Click Deploy</h3>
                           <p className="text-slate-400 leading-relaxed">Seamlessly connect your wallet and deploy generated contracts directly to the blockchain.</p>
                       </div>
                   </div>
                </div>
             </section>
          </main>
          
          <footer className="py-8 border-t border-white/5 bg-[#141416] text-center text-slate-500 text-sm">
             <p>&copy; {new Date().getFullYear()} PolySol Studio. All rights reserved.</p>
          </footer>
        </motion.div>
      )}
    </>
  );
}
