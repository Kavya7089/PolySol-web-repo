/** @contract */
class SimpleWallet {
    /** @type {address} */
    owner;

    /** @type {uint256} */
    balance;

    constructor() {
        this.owner = msg.sender;
        this.balance = 0;
    }

  /** @payable */
  function deposit() {
    this.balance += msg.value;
}

function withdraw(amount) {
    require(msg.sender === this.owner, "Only owner can withdraw");
    require(this.balance >= amount, "Insufficient balance");
    this.balance -= amount;
}

function getBalance() {
    return this.balance;
}
}
