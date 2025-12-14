import { Terminal, Shield, Workflow, Code, Coins, Zap } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 md:px-6 mt-4 mb-4">
      {/* Main Card Container */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="mb-10 text-center border-b border-slate-800 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white glow-text">
            Rules & Syntax
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Follow these strict guidelines to ensure 100% compilation accuracy.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-slate-800 bg-slate-950/50 p-6 transition-all hover:bg-slate-900 hover:border-blue-500/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                <rule.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {rule.title}
              </h3>
              <p className="mb-4 text-sm text-slate-400 leading-relaxed">
                {rule.description}
              </p>
              <div className="rounded-md bg-black/60 p-3 font-mono text-[11px] text-blue-300 border border-slate-800">
                {rule.code.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip Footer */}
        <div className="mt-10 p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-400 mt-1 shrink-0" />
            <p className="text-xs text-blue-200 leading-relaxed">
                <strong>Pro Tip:</strong> PolySol uses a Heuristic Engine. If you name a variable <code className="text-blue-300">owner</code> or <code className="text-blue-300">receiver</code>, the compiler will automatically infer the type as <code className="text-white">address</code> even if you forget the JSDoc tag!
            </p>
        </div>
      </div>
    </div>
  );
}

const rules = [
  {
    title: "The Modifier Hole",
    description:
      "In Java/JS, use `_();` to represent the Solidity `_;` merge point. This tells the compiler where to execute the main function body.",
    code: "void onlyOwner() {\n  require(msg.sender == owner);\n  _(); \n}",
    icon: Shield,
  },
  {
    title: "Automatic Payable",
    description: "You no longer need to cast addresses manually. Using `.transfer()` on any variable triggers an automatic `payable(...)` wrapper.",
    code: "this.seller.transfer(amount);\n// Result: payable(seller).transfer(amount);",
    icon: Coins,
  },
  {
    title: "Type Inference",
    description: "For JavaScript, use JSDoc. For Java, use standard types. Note: 'int' in Java becomes 'uint256' in Solidity by default.",
    code: "/** @type {uint256} */\nlet balance;\n\n// Or Java:\nuint256 count;",
    icon: Code,
  },
  {
    title: "Blockchain Globals",
    description: "Use global variables like `msg.sender`, `msg.value`, and `block.timestamp` directly. Do not wrap them in quotes.",
    code: "address user = msg.sender;\nuint256 sent = msg.value;",
    icon: Workflow,
  },
  {
    title: "Memory vs Storage",
    description: "Complex types (Strings, Arrays) in function arguments are automatically mapped to 'memory' to ensure gas efficiency.",
    code: "void setName(String name) {\n  this.userName = name;\n}",
    icon: Terminal,
  },
  {
    title: "Constructors",
    description: "Standard class constructors map directly to Solidity constructors. Use them to initialize your owner and state.",
    code: "constructor() {\n  this.owner = msg.sender;\n}",
    icon: Workflow,
  },
];