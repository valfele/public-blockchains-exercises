require("@nomicfoundation/hardhat-toolbox");

const path = require('path');
const res = require('dotenv')
  .config({ path: path.resolve(__dirname, '..', '.env') });

const sepoliaUrl = `${process.env.ALCHEMY_SEPOLIA_API_URL}${process.env.ALCHEMY_KEY}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    
    solidity: "0.8.24",
    
    defaultNetwork: "localhost",

    networks: {
        hardhat: {
        },
        sepolia: {
            url: `${process.env.ALCHEMY_SEPOLIA_API_URL}${process.env.ALCHEMY_KEY}`,
            accounts: [process.env.METAMASK_1_PRIVATE_KEY]
        }
    }
};
