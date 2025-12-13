import { Terminal, Shield, Workflow, Code, Coins } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 lg:text-5xl">
          Rules & Syntax
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Strict guidelines for transpiling Java/JS to Solidity using PolySol.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-900"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
              <rule.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-200">
              {rule.title}
            </h3>
            <p className="mb-4 text-slate-400">{rule.description}</p>
            <div className="rounded-md bg-slate-950 p-3 font-mono text-xs text-indigo-300">
              {rule.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const rules = [
  {
    title: "Modifiers",
    description:
      "Use `_();` inside function bodies to represent the Solidity `_;` merge point.",
    code: "function onlyOwner() { require(msg.sender == owner); _(); }",
    icon: Shield,
  },
  {
    title: "JSDoc / Javadoc Types",
    description: "All state variables must have a type tag using JSDoc/Javadoc syntax.",
    code: "/** @type {uint256} */\nlet balance;",
    icon: Code,
  },
  {
    title: "Inheritance",
    description: "Use standard class inheritance. It maps directly to Solidity inheritance.",
    code: "class MyContract extends Parent { ... }",
    icon: Workflow,
  },
  {
    title: "Interfaces",
    description:
      "Use the `interface` keyword (Java) or `/** @interface */` JSDoc tag (JS).",
    code: "interface IERC20 { ... }",
    icon: Terminal,
  },
  {
    title: "Payable Functions",
    description: "Add `@payable` to comments to allow functions to accept ETH.",
    code: "/** @payable */\nfunction deposit() { ... }",
    icon: Coins,
  },
];
