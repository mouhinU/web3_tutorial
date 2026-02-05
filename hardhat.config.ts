import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers"
import HardhatIgnitionEthersPlugin from "@nomicfoundation/hardhat-ignition-ethers"
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers"
import hardhatVerify from "@nomicfoundation/hardhat-verify"
import { configVariable, defineConfig, task } from "hardhat/config"

// import "@openzeppelin/hardhat-upgrades"

// 任务配置
const accounts = task("accounts", "Print the accounts")
    .setAction(() => import("./tasks/account.js"))
    .build()

console.info("Hardhat config loaded")
// Hardhat 配置
export default defineConfig({
    // 插件配置
    plugins: [
        // Hardhat Toolbox 插件配置
        hardhatToolboxMochaEthersPlugin,
        hardhatToolboxMochaEthers,
        // Hardhat Ignition 插件配置
        HardhatIgnitionEthersPlugin,
        // Hardhat Verify 插件配置
        hardhatVerify,
    ],
    tasks: [accounts],
    // Solidity 编译器配置
    solidity: {
        profiles: {
            // 默认 Solidity 编译器配置
            default: {
                version: "0.8.28",
            },
            // 生产环境 Solidity 编译器配置
            production: {
                version: "0.8.28",
                settings: {
                    // 开启 Solidity 优化器
                    optimizer: {
                        enabled: true,
                        // 优化器运行次数
                        runs: 200,
                    },
                },
            },
        },
        // 编译时需要包含的合约文件
        npmFilesToBuild: [
            "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol",
            "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
            "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol",
        ],
    },
    // 部署合约
    ignition: {
        // 部署合约时需要确认的交易数量
        requiredConfirmations: 5,
    },
    // 测试配置
    test: {
        mocha: {
            // 测试用例执行超时时间
            timeout: 18000000,
            color: true,
            // reporter: "ethereum-tester",
        },
    },
    // 测试网络配置
    networks: {
        // 本地 Hardhat 网络配置
        hardhatMainnet: {
            chainId: 31337,
            type: "edr-simulated",
            chainType: "l1",
        },
        // 本地 Hardhat 网络配置（Optimism）
        hardhatOp: {
            chainId: 31337,
            type: "edr-simulated",
            chainType: "op",
        },
        // Sepolia 测试网络配置
        sepolia: {
            // Sepolia 测试网络链 ID
            chainId: 11155111,
            // Sepolia 测试网络类型
            type: "http",
            // Sepolia 测试网络链类型
            chainType: "l1",
            // Sepolia 测试网络 RPC URL
            url: configVariable("SEPOLIA_RPC_URL"),
            // Sepolia 测试网络账户私钥
            accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
        },
        amoy: {
            chainId: 80002,
            type: "http",
            chainType: "l1",
            url: "https://polygon-amoy.g.alchemy.com/v2/ZYL-7uUaIDhGhdhasgsTf",
            accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
        },
    },
    // 合约验证配置
    verify: {
        etherscan: {
            // Etherscan API 密钥
            apiKey: "9I4XRW8UHW2HKPFN8SF3H2P6EU7A1KKBPZ",
        },
    },
})
