import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers"
import HardhatIgnitionEthersPlugin from "@nomicfoundation/hardhat-ignition-ethers"
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers"
import hardhatVerify from "@nomicfoundation/hardhat-verify"

import { configVariable, defineConfig } from "hardhat/config"

console.info("Hardhat config loaded")
export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatToolboxMochaEthers, HardhatIgnitionEthersPlugin, hardhatVerify],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
    npmFilesToBuild: [
      "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol",
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
    ],
  },
  test: {
    mocha: {
      timeout: 600000,
      color: true,
      // reporter: "ethereum-tester",
    },
  },
  networks: {
    hardhatMainnet: {
      chainId: 31337,
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      chainId: 31337,
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      chainId: 11155111,
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
  verify: {
    etherscan: {
      apiKey: "9I4XRW8UHW2HKPFN8SF3H2P6EU7A1KKBPZ",
    },
  },
})
