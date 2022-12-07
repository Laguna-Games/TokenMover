require("@nomicfoundation/hardhat-toolbox")
require('@nomicfoundation/hardhat-chai-matchers')
require("@nomiclabs/hardhat-etherscan")
require('solidity-coverage')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["deploy-pkey"]
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: ["deploy-pkey"]
    }
  },
  etherscan: {
    apiKey: {
        mainnet: "polygonscan_api_key",
        polygon: "polygonscan_api_key",
        polygonMumbai: "polygonscan_api_key"
    }
  }
}
