const SHA256 = require('crypto-js/sha256')

class Block{

    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        //we will be using SHA256 cryptographic function to generate the hash ogf this block
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
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
        this.difficulty = 5;
    }

    createGenesisBlock(){
        return new Block(0, "11/05/2021", "This is a Genesis Block", "0");
    }

    // Creating other blocks: Requirements
    // 1. new block object
    // 2. the hash of the previous block
    // 3. calculating the hash of the current block

    // function to return the previous block:
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // fumction for adding the new block
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineNewBlock(this.difficulty);
        this.chain.push(newBlock);
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


// blocks
let block1 = new Block(1, "12/05/2021",{mybalance: 100});
let block2 = new Block(2, "13/05/2021",{mybalance: 50});

// blockcahin
let myblockchain = new BlockChain();

// adding new blocks
console.log("The First Block Creation")
myblockchain.addBlock(block1);
console.log("The Second Block Creation")
myblockchain.addBlock(block2);

console.log(JSON.stringify(myblockchain, null, 4))
// console.log("Validation Check for the BlockChain before Hacking: " + myblockchain.checkBlockChainValid());

// myblockchain.chain[1].data = {mybalance: 10};
// console.log(JSON.stringify(myblockchain, null, 4))
// console.log("Validation Check for the BlockChain after Hacking: " + myblockchain.checkBlockChainValid());
