const SHA256 = require('crypto-js/sha256')

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {

    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        //we will be using SHA256 cryptographic function to generate the hash ogf this block
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }
    
    // adding difficulty for hashing
    mineNewBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
            // 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        }
        console.log("A new block was mined with hash: " + this.hash)
    }
}

class BlockChain{
    constructor(){
        //the first variable of the array will be the genesis block, created manually
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;

        this.pendingTransactions = [];
        this.minigReward = 10;
    }

    createGenesisBlock(){
        return new Block("11/05/2021", "This is a Genesis Block", "0");
    }

    // Creating other blocks: Requirements
    // 1. new block object
    // 2. the hash of the previous block
    // 3. calculating the hash of the current block

    // function to return the previous block:
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(minigRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully");

        //adding the block to chain
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, minigRewardAddress, this.minigReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const transaction of block.transactions){
                if(transaction.fromAddress === address){
                    balance = balance - transaction.amount;
                }
                if(transaction.toAddress === address){
                    balance = balance + transaction.amount;
                }
            }
        }
        return balance;
    }

    // function for validating the blockchain security
    checkBlockChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true
    }
}


let bittyCoin = new BlockChain();

transaction1 = new Transaction("Tom", "Jerry", 100);
bittyCoin.createTransaction(transaction1);

transaction2 = new Transaction("Jerry", "Tom", 30);
bittyCoin.createTransaction(transaction2);


console.log("Started Mining by Miner");
bittyCoin.minePendingTransactions("Pooja");

console.log("Tom's Balance: " + bittyCoin.getBalanceOfAddress("Tom"));
console.log("Jerry's Balance: " + bittyCoin.getBalanceOfAddress("Jerry"));
console.log("Pooja's Balance: " + bittyCoin.getBalanceOfAddress("Pooja"));

console.log("Started Mining again by Miner");
bittyCoin.minePendingTransactions("Pooja");

console.log("Pooja's Balance: " + bittyCoin.getBalanceOfAddress("Pooja"));