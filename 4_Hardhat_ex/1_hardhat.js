// Hardhat: First interaction with Hardhat blockchain.
//////////////////////////////////////////////////////

// Exercise 0. Load dependencies and network provider.
//////////////////////////////////////////////////////

// a. Require the `dotenv` and `ethers` packages.
// Hint: As you did multiple times now.

const path = require('path');
const ethers = require("ethers");
let pathToDotEnv = path.resolve(process.cwd(), '.env');
require('dotenv').config({ path: pathToDotEnv }); 


// Exercise 1. Create a JSON RPC Provider for the Hardhat blockchain.
/////////////////////////////////////////////////////////////////////

// Hint: you will find the info printed to console after you start the hardhat
// blockchain.

const hardhatUrl = 'http://127.0.0.1:8545/'
const hardhatProvider = new ethers.JsonRpcProvider(hardhatUrl);

// Exercise 2. Let's query the provider.
////////////////////////////////////////

// Hardhat Blockchain si too long. Let's call it NUMA.
// Print to console the network name, chain id, and block number of NUMA.

const networkInfo = async () => {
   
    let network = await hardhatProvider.getNetwork();
    console.log('network name: ', network.name)
    console.log('chain Id: ', Number(network.chainId))
    let blockNumber= await hardhatProvider.getBlockNumber()
    console.log('block number: ', blockNumber)
    
};

 

networkInfo();
 // return; 


// Exercise 3. Signer on the Hardhat blockchain.
////////////////////////////////////////////////

// a. Connect one a signer with one of the default private keys on
// the Hardhat blockchain.
// Hint: check the Hardhat console output.

let signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
console.log(signer.address)

// b. Check the balance of the signer.

const checkBalance = async () => {
    let balance = await hardhatProvider.getBalance(signer.address);
    console.log('Balance: ', Number(balance));
};

checkBalance();

 

// c. Print the signer's next nonce necessary to send a transaction.
// Hint: .getNonce()

const getNonce = async() => {

    signer = await signer.connect(hardhatProvider);
    let nonce = await signer.getNonce();
    console.log(nonce);
};

getNonce();


// Exercise 4. Send a transaction.
//////////////////////////////////

// Send some Ether from the address of the signer in Exercise 3 to one of your
// accounts on Metamask (e.g., the one used to make the submissions in 
// this course).

const account2 = process.env.METAMASK_2_ADDRESS;

const sendTransaction = async () => {

    await hardhatProvider.getBalance(signer.address);

    tx = await signer.sendTransaction({
        to: account2,
        value: ethers.parseEther("0.01")
    });

    console.log('Transaction is in the mempool...');
    await tx.wait();

    let updatedB1 = await hardhatProvider.getBalance(signer.address);
    let updatedB2 = await hardhatProvider.getBalance(account2);

    console.log('signer balance: ', Number(updatedB1));
    console.log('receiver balance: ', Number(updatedB2));
};

sendTransaction();

return;