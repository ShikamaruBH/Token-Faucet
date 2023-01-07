require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || ''
const apiKey = process.env.API_KEY || ''

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${apiKey}`,
      accounts: privateKeys.split(','),
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
    }
  }
};
