/** @contract */
class ERC20Token {
    /** @type {string} */
    name;

    /** @type {string} */
    symbol;

    /** @type {uint256} */
    totalSupply;

    /** @type {mapping(address => uint256)} */
    balances;

    constructor(tokenName, tokenSymbol, initialSupply) {
        this.name = tokenName;
        this.symbol = tokenSymbol;
        this.totalSupply = initialSupply;
        this.balances = {};
        this.balances[msg.sender] = initialSupply;
    }

    transfer(to, amount) {
        require(this.balances[msg.sender] >= amount, "Insufficient balance");
        this.balances[msg.sender] -= amount;
        this.balances[to] += amount;
    }

    balanceOf(account) {
        return this.balances[account] || 0;
    }
}
