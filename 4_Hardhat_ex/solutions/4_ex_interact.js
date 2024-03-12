////////////////////////////////////////////////////////////////////////
// Attention!
// You should not execute this file here, but rather copy it
// inside the scripts/ directory of a newly inited hardhat project.
////////////////////////////////////////////////////////////////////////

const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);

// Import the wrapped version of ethers by Hardhat.
// See: https://www.npmjs.com/package/@nomiclabs/hardhat-ethers
const ethers = hre.ethers;
console.log("Ethers version:", ethers.version);


// Exercise 1. Interact with your new Lock Solidity contract (READ).
///////////////////////////////////////////////////////////////

// If you remember from 3_EtherJS/2_signer.js, to interact with a smart 
// contract you need three pieces of information:
// 1. The contract address.
// 2. The ABI
// 3. A signer (with access to a provider)

// Here it is the same, however the Hardhat wrapped version of Ether makes
// things a bit easier, as I mentioned earlier.

// a. Update with your contract's name and address.
// Hint: The address is known only after deployment.
const contractName = "Lock2";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Let's continue inside the async main function (the recommended Hardhat
// pattern of execution).

async function main() {
  
  // b. Get the first of the default Hardhat signers. Print its address, and
  // checks that it matches the first address printed to console when you
  // execute: npx hardhat node
  // Hint: ethers.getSigners() returns an array of signers.

  const hardhatSigners = await ethers.getSigners();
  const hhSigner = hardhatSigners[0];
  const hhAddress = hhSigner.address;

  console.log("HH Signer address:", hhAddress);
  
  // c. Get the provider.
  // Hint: available under hre.ethers.provider;

  const provider = ethers.provider;
  // const { name, chainId } = await provider.getNetwork();
  // console.log(name, chainId);
  
  // return

  // d. Get your new contract. Hardhat Ethers automatically fetches the ABI from
  // the artifacts, so you don't need to specify it. Use the method
  // ethers.getContractAt(<name>, <address>, <signer>)
  // then print the contract address.

  const lock = await ethers.getContractAt(contractName,
                                          contractAddress,
                                          hhSigner);  
  

  console.log(contractName + " address", lock.target); 

  // Exercise 3. Interact with your new Solidity contract (WRITE).
  ////////////////////////////////////////////////////////////////

  // a. Let's try to withdraw from the lock. 
  // Print the balance before and after withdrawal.
  
  // Hint0: the balance of an address is accessible via the provider.

  // Hint1: Invoke the asynchronous withdraw method.
  
  // Hint2: Ethers Syntax for formatting formatEther:
  // balance = ethers.formatEther(balance);

  // Hint3: Do you get an error? You should! Check the long error msg for
  // the reason.

  const withdrawAttempt1 = async (lockContract = lock) => {
    let b1 = await provider.getBalance(hhAddress);
    b1 = ethers.formatEther(b1);
    console.log('The balance before withdrawing is ', b1);

    console.log("Withdrawing from Lock");
    await lockContract.withdraw();

    let b2 = await provider.getBalance(hhAddress);
    b2 = ethers.formatEther(b2);
    console.log('The balance after withdrawing is ', b2);
  };

  // await withdrawAttempt1();
  
  // Exercise 3. Remove the check for unlock date (WRITE).
  ////////////////////////////////////////////////////////////////////

  // a. Comment out the `require` checking for the unlock date 
  // inside the Solidity contract.

  // b. Deploy the Lock2 contract again and try to withdraw now.
  // Hint: the contract address will be different.
  
  const withdrawAgain = async() => {
    const newContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

      // Wrapped Ethers.
        const newLock = await ethers.getContractAt(contractName,
          newContractAddress,
          hhSigner);

      // Can also print:
      // console.log(newLock.target);
      // await readContract(newLock);  

    await withdrawAttempt1(newLock);
  };
  
  // await withdrawAgain();
  


  // Exercise 4. Bonus. Connect with another address (WRITE).
  //////////////////////////////////////////////////////////

  // Redeploy the Lock2 contract and try to withdraw from an address that
  // is not the owner. It should trigger an error from the second
  // `require` statement in the withdraw method.

  // Hint: make sure that the non-owner address has Ether to send a transaction.

  const triggerNotOwner = async () => {
    console.log('Triggering not owner...\n');

    const thirdContractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    
    // b.1 Require the `dotenv` package.
    // For execution with npx you need to specify the path from the directory 
    // of execution. E.g., if you execute from 4_Hardhat/scripts/:
    require('dotenv').config({ path: "../../.env" });

    /// b.2 Create a new signer with one of your Metamask private keys.
    const nonOwner = new ethers.Wallet(process.env.METAMASK_1_PRIVATE_KEY,
                                       provider);

    // b.3 Get the contract instance and then try to withdraw.
    // Hint: You could use the method `getContractManual` created before

    // Wrapped Ethers.
    const newLock = await ethers.getContractAt(contractName,
      thirdContractAddress,
      nonOwner);

    const owner = await newLock.owner();
    console.log('Owner is     ' + owner);
    console.log('Non-Owner is ' + nonOwner.address + '\n');

   // Standard Ethers
   // const newLock = await getContractManual(nonOwner, thirdContractAddress);

    await newLock.withdraw();
  
  };

  await triggerNotOwner();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
