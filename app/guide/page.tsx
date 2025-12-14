import Link from "next/link";
import { ArrowRight, Terminal, FileCode, Play, UploadCloud } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 md:px-6 mt-4 mb-4">
      {/* Main Card Container */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="mb-10 text-center border-b border-slate-800 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white glow-text">
            Quick Start Guide
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            From zero to deployed smart contract in less than 5 minutes.
          </p>
        </div>

        {/* Steps Content */}
        <div className="space-y-8">
          
          {/* STEP 1 */}
          <Step 
            number="1" 
            title="Installation" 
            icon={Terminal}
            description="Install the PolySol CLI globally on your machine."
          >
            <code className="block w-full rounded-lg bg-black/50 border border-slate-700 p-4 font-mono text-blue-300 overflow-x-auto">
              npm install -g polysol
            </code>
          </Step>

          {/* STEP 2 */}
          <Step 
            number="2" 
            title="Write Your Logic" 
            icon={FileCode}
            description="Create a Java file (e.g., Counter.java). PolySol auto-maps types like 'int' to 'uint256'."
          >
            <div className="rounded-t-md bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700">
                src/Counter.java
            </div>
            <pre className="w-full overflow-x-auto rounded-b-lg bg-black/50 border border-t-0 border-slate-700 p-4 font-mono text-sm text-slate-300 custom-scrollbar">
{`public class Counter {
    int count;

    public void increment() {
        this.count += 1;
    }

    public int getCount() {
        return this.count;
    }
}`}
            </pre>
          </Step>

          {/* STEP 3 */}
          <Step 
            number="3" 
            title="Transpile to Solidity" 
            icon={Play}
            description="Run the compiler. It detects your file type and applies security wrappers automatically."
          >
            <code className="block w-full rounded-lg bg-black/50 border border-slate-700 p-4 font-mono text-green-400 overflow-x-auto">
              npx polysol compile src/Counter.java
            </code>
            <div className="mt-2 text-xs text-slate-500 font-mono">
              Output: ./dist/Counter.sol
            </div>
          </Step>

          {/* STEP 4 */}
          <Step 
            number="4" 
            title="Deploy" 
            icon={UploadCloud}
            description="Choose how you want to launch your contract:"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="rounded-lg bg-slate-900/80 border border-slate-700 p-4 hover:border-blue-500/30 transition-colors">
                    <h4 className="font-bold text-white mb-2 text-sm">Option A: Web Playground</h4>
                    <p className="text-xs text-slate-400 mb-3">Instant deployment via Remix IDE.</p>
                    <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 flex items-center font-semibold">
                        Go to Playground <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>
                <div className="rounded-lg bg-slate-900/80 border border-slate-700 p-4 hover:border-purple-500/30 transition-colors">
                    <h4 className="font-bold text-white mb-2 text-sm">Option B: Hardhat</h4>
                    <p className="text-xs text-slate-400 mb-3">For local development.</p>
                    <code className="text-[10px] bg-black/50 p-1 rounded text-purple-300">npx hardhat run deploy.js</code>
                </div>
            </div>
          </Step>
          
          {/* Footer / CTA */}
          <div className="flex justify-center pt-8 border-t border-slate-800">
              <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25">
                  Try the Online Compiler <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Step Component (Restored to your exact style)
function Step({ number, title, icon: Icon, description, children }: {
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col md:flex-row gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 transition-all hover:bg-slate-800/50 hover:border-blue-500/30">
      
      {/* Number Badge */}
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white font-bold ring-1 ring-white/10 group-hover:bg-blue-600 group-hover:ring-blue-400 transition-colors shadow-lg">
            {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <h3 className="text-xl font-bold text-white content-center pt-1">{title}</h3>
        </div>
        
        {description && <p className="text-slate-400 leading-relaxed">{description}</p>}
        
        <div className="mt-2">
            {children}
        </div>
      </div>
    </div>
  );
}