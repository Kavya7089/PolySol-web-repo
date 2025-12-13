export type SourceLanguage = "javascript" | "java";

export function transpile(code: string): string {
  // In a real implementation, this would call the actual PolySol library.
  // For now, we mock the output based on standard patterns.

  if (!code.trim()) return "";

  const contractMatch = code.match(/class\s+(\w+)/);
  const contractName = contractMatch ? contractMatch[1] : "MyContract";

  let solidity = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract ${contractName} {\n`;

  // Mocking state variables
  if (code.includes("@type")) {
    solidity += "    // State variables transpiled from JSDoc\n";
    // This is a very naive mock
    if (code.includes("uint256")) solidity += "    uint256 public val;\n";
    if (code.includes("address")) solidity += "    address public owner;\n";
  }

  // Mocking constructor
  if (code.includes("constructor")) {
    solidity += "\n    constructor() {\n        // Constructor logic\n    }\n";
  }

  // Mocking functions
  if (code.includes("function")) {
    solidity += "\n    function action() external {\n        // Function logic\n    }\n";
  }

  solidity += "}";

  return solidity;
}

export const EXAMPLE_JS = `/**
 * @contract MyToken
 */
class MyToken {
    /** @type {string} */
    name = "PolyToken";
    
    /** @type {string} */
    symbol = "PTK";
    
    /** @type {uint256} */
    totalSupply = 1000000;

    /** @type {mapping(address => uint256)} */
    balances;

    constructor() {
        this.balances = {};
        this.balances[msg.sender] = this.totalSupply;
    }

    /** 
     * @param {address} to
     * @param {uint256} amount 
     */
    transfer(to, amount) {
        require(this.balances[msg.sender] >= amount, "Low balance");
        this.balances[msg.sender] -= amount;
        this.balances[to] += amount;
    }
    
    balanceOf(account) {
        return this.balances[account];
    }
}`;

export const EXAMPLE_JAVA = `/** @contract */
class Counter {
  /** @type {uint256} */
  private int count;

  public Counter() {
    this.count = 0;
  }

  public void increment() {
    this.count = this.count + 1;
  }

  public int getCount() {
    return this.count;
  }
}`;
