import Link from "next/link";
import { ArrowRight, Download, FileText, Play, Rocket } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
          How to Use
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          From installation to deployment in 4 simple steps.
        </p>
      </div>

      <div className="space-y-8">
        <Step 
          number="1" 
          title="Install via CLI" 
          icon={Download}
          description="Install the PolySol compiler globally using npm."
        >
          <code className="block w-full rounded bg-slate-950 p-4 font-mono text-sm text-indigo-300">
            npm install -g polysol-js-core
          </code>
        </Step>

        <Step 
          number="2" 
          title="Write your Contract" 
          icon={FileText}
          description="Create a JavaScript or Java file. Here is an example of a Crowdfund contract."
        >
          <pre className="w-full overflow-x-auto rounded bg-slate-950 p-4 font-mono text-xs text-slate-300">
{`/** @contract */
class CrowdFund {
  /** @type {address} */
  owner;
  /** @type {uint256} */
  goal;

  constructor(target) {
    this.owner = msg.sender;
    this.goal = target;
  }

  /** @payable */
  contribute() {
    // Logic here...
  }
}`}
          </pre>
        </Step>

        <Step 
          number="3" 
          title="Run the Transpiler" 
          icon={Play}
          description="Compile your code into Solidity."
        >
          <code className="block w-full rounded bg-slate-950 p-4 font-mono text-sm text-indigo-300">
            polysol compile CrowdFund.js
          </code>
        </Step>

        <Step 
          number="4" 
          title="Deploy with Hardhat" 
          icon={Rocket}
          description="Use the generated Solidity files in your standard Web3 workflow."
        >
          <p className="text-sm text-slate-400">
            The output describes standard .sol files located in your configured output directory.
            You can import these into any Hardhat or Foundry project.
          </p>
        </Step>
        
        <div className="flex justify-center pt-8">
            <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 hover:text-white">
                Go to Playground <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, icon: Icon, description, children }: {
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-6 rounded-xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 font-bold text-slate-200">
        {number}
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-indigo-400" />
          <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        </div>
        <p className="text-slate-400">{description}</p>
        {children}
      </div>
    </div>
  );
}
