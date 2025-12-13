import { Info, Cpu, AlertTriangle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-12 border-b border-slate-800 pb-8">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-100">
          About PolySol
        </h1>
        <p className="text-xl text-slate-400">
          Bridging the gap between Web2 languages and the EVM.
        </p>
      </div>

      <div className="space-y-12">
        <section className="flex gap-4">
          <div className="mt-1 flex-shrink-0 text-indigo-400">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-200">Our Mission</h2>
            <p className="leading-relaxed text-slate-400">
              PolySol aims to make Web3 development accessible to millions of Java
              and JavaScript developers. By providing a familiar syntax that compiles 
              down to Solidity, we lower the barrier to entry for building decentralized applications.
            </p>
          </div>
        </section>

        <section className="flex gap-4">
          <div className="mt-1 flex-shrink-0 text-indigo-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-200">Architecture</h2>
            <p className="leading-relaxed text-slate-400">
              PolySol uses a custom Intermediate Representation (IR) to map Object-Oriented 
              Programming (OOP) concepts from Java/JS directly to Solidity contracts. 
              It handles type inference, inheritance resolution, and modifier logic translation.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-yellow-900/50 bg-yellow-950/10 p-6">
          <div className="flex gap-4">
            <div className="mt-1 flex-shrink-0 text-yellow-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-yellow-500">Disclaimer</h2>
              <p className="text-sm leading-relaxed text-yellow-200/80">
                PolySol is intended for logic-heavy applications and rapid prototyping. 
                While we strive for efficiency, the generated code may not be as gas-optimized 
                as hand-written assembly or highly tuned Solidity. Always audit your code before mainnet deployment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
