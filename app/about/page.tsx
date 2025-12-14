import { Info, Cpu, Shield, Zap, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 mt-4 mb-4">
      <div className="bg-slate-900/80 backdrop-blur-sm transition-colors rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="mb-12 border-b border-slate-800 pb-8 text-center md:text-left">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white glow-text">
            About PolySol
          </h1>
            <p className="text-xl text-blue-400 font-medium">
            The World&apos;s First Java & JavaScript to Solidity Compiler Platform.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Mission */}
          <section className="flex gap-4">
            <div className="mt-1 flex-shrink-0 text-blue-500">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white">Our Mission</h2>
              <p className="leading-relaxed text-slate-300">
                There are 20 million Java and JavaScript developers, but fewer than 200k Solidity experts. 
                PolySol breaks down the &quot;Wall of Solidity&quot; by allowing you to write production-grade Smart Contracts 
                in the languages you have used for years.
              </p>
            </div>
          </section>

          {/* How it Works (Updated for Heuristics) */}
          <section className="flex gap-4">
            <div className="mt-1 flex-shrink-0 text-blue-500">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white">Under the Hood</h2>
              <p className="leading-relaxed text-slate-300">
                PolySol is not a simple text replacer. It features a custom <strong>Intermediate Representation (IR)</strong> engine 
                that parses Abstract Syntax Trees (AST) from JS and Java. 
                <br /><br />
                It uses a <strong>Heuristic Inference Engine</strong> to detect blockchain-specific patterns—like guessing that a variable named &quot;owner&quot; should be an <code>address</code>, or that a function updating a balance must use <code>payable</code> transfers.
              </p>
            </div>
          </section>

          {/* Power Features (New Section) */}
          <section className="flex gap-4">
            <div className="mt-1 flex-shrink-0 text-blue-500">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Power Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureItem title="Multi-Language Support">
                  Native support for both <strong>JavaScript</strong> and <strong>Java</strong> (OOP) syntax.
                </FeatureItem>
                <FeatureItem title="Smart Security">
                  Auto-injects <code className="code-tag">require</code> checks and <code className="code-tag">payable</code> wrappers to prevent stuck funds.
                </FeatureItem>
                <FeatureItem title="One-Click Deploy">
                  Integrated directly with <strong>Remix IDE</strong> and <strong>Hardhat</strong> for instant mainnet launches.
                </FeatureItem>
                <FeatureItem title="Global Context">
                  Understands Web3 globals like <code className="code-tag">msg.sender</code> and <code className="code-tag">msg.value</code> automatically.
                </FeatureItem>
              </ul>
            </div>
          </section>

          {/* Why Use It */}
          <section className="flex gap-4">
            <div className="mt-1 flex-shrink-0 text-blue-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Why PolySol?</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-200">Production Ready Logic:</strong>
                    <span className="text-slate-400 block">We handle constructors, modifiers, and inheritance so you don&apos;t have to.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-200">Zero Learning Curve:</strong>
                    <span className="text-slate-400 block">Use your existing IDE, linters, and testing tools.</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Team */}
          <section className="flex gap-4 pt-6 border-t border-slate-800/50">
            <div className="mt-1 flex-shrink-0 text-blue-500">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white">The Team</h2>
              <p className="leading-relaxed text-slate-300">
                Built by passionate blockchain engineers to democratize Web3 development.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Helper Component for the Grid
function FeatureItem({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <li className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <strong className="text-blue-200 block mb-1">{title}</strong>
            <span className="text-slate-400 text-sm leading-snug block">{children}</span>
        </li>
    )
}