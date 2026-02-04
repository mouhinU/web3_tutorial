import hre from "hardhat"
import { assert, expect } from "chai"

import NMCTokenToV1Module from "../ignition/modules/upgradeable/NFTProxyToV1Module.js"
import NFTUpgradeToV2Module from "../ignition/modules/upgradeable/NFTUpgradeToV2Module.js"
import NFTUpgradeToV3Module from "../ignition/modules/upgradeable/NFTUpgradeToV3Module.js"
import NFTUpgradeToV4Module from "../ignition/modules/upgradeable/NFTUpgradeToV4Module.js"

// 代理合约地址
const proxyAddress = "0xe036165d296Aa49ABEfB6c5E8FD3c3f67faBE204"

/// @notice Test NMCToken Proxy interaction
/// @dev Test NMCToken Proxy interaction
describe("NMCToken Proxy", async function () {
    /// @notice Test NMCToken Proxy interaction
    /// @dev Test NMCToken Proxy interaction
    describe("NMCToken Proxy interaction", function () {
        it("1、NMCToken Should be usable via proxy", async function () {
            // const accounts = await ethers.getSigners()
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const [, otherAccount] = await ethers.getSigners()
            // console.info(`otherAccount address: ${otherAccount.address}`)
            const connect = await hre.network.connect()
            // 部署 NMCToken V1 合约并获取其透明可升级代理合约实例
            const { nmcToken } = await connect.ignition.deploy(NMCTokenToV1Module)
            console.info(`nmcToken v1 Proxy address: ${nmcToken.target}`)
            // 调用 NMCToken V1 合约的 getNextTokenId 函数获取下一个tokenId
            const nextTokenId = await nmcToken.getNextTokenId()
            console.info(nextTokenId)
        })
    })

    describe("Upgrading to V2 NMCTokenToV2Module", function () {
        // 部署V2合约
        it("2、Should have upgraded the proxy to NMCTokenToV2Module", async function () {
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, nmcTokenProxy } = await connect.ignition.deploy(NFTUpgradeToV2Module)
            console.info(`nmcToken v2 address: ${nmcTokenProxy.target}`)
            const totalSupply = await nmcTokenProxy.getTotalSupply()
            console.log(`totalSupply :${totalSupply}`)
        })

        // 更改Owner为Account 0
        it("3、TransferOwnership to otherAccount", async function () {
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const [, otherAccount] = await ethers.getSigners()
            const nmcTokenProxy = await ethers.getContractAt("NMCTokenV2", proxyAddress)
            const tx = await nmcTokenProxy.transferOwnership(accounts[0]?.address)
            const txReceipt = await tx.wait()
            console.log(txReceipt)
        })

        // 设置MaxSupply为2000000
        it("4、Should have setMaxSupply to 99600000", async function () {
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, nmcTokenProxy } = await connect.ignition.deploy(NFTUpgradeToV2Module)
            console.info(`nmcToken v2 address: ${nmcTokenProxy.target}`)
            const tx = await nmcTokenProxy.setMaxSupply(99600000)
            const txReceipt = await tx.wait()
            console.log(txReceipt)
            const totalSupply = await nmcTokenProxy.getTotalSupply()
            console.log(`totalSupply :${totalSupply}`)
        })

        it("5、Should check who is the current owner", async function () {
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            // Get the proxy contract instance
            const nmcTokenProxy = await ethers.getContractAt("NMCTokenV2", proxyAddress)

            // Check current owner
            const currentOwner = await nmcTokenProxy.owner()
            console.log(`Current owner of proxy contract: ${currentOwner}`)
            console.log(`Account 0: ${accounts[0]?.address}`)
            console.log(`Account 1: ${accounts[1]?.address}`)

            // Check if V2 is already initialized
            try {
                await nmcTokenProxy.getTotalSupply()
                console.log("V2 features appear to be already initialized")
            } catch (error) {
                console.log("V2 features need initialization")
            }
        })
    })

    describe("Upgrading to V3 NMCTokenToV3Module", function () {
        // 部署V3合约
        it("6、Should have upgraded the proxy to NMCTokenToV3Module", async function () {
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, nmcTokenProxy } = await connect.ignition.deploy(NFTUpgradeToV3Module)
            console.info(`nmcToken v3 address: ${nmcTokenProxy.target}`)
            const totalSupply = await nmcTokenProxy.getTotalSupply()
            console.log(`totalSupply :${totalSupply}`)

            const configured = await nmcTokenProxy.isV3Configured()
            console.log(`_v3Configured :${configured}`)

            const lastTimeStamp = await nmcTokenProxy.getLastTimeStamp()
            const formattedDate = new Date(Number(lastTimeStamp) * 1000).toLocaleString()
            console.log(`lastTimeStamp :${lastTimeStamp} (${formattedDate})`)
        })
    })

    describe("Upgrading to V4 NFTUpgradeToV4Module", function () {
        // 部署V4合约
        it("6、Should have upgraded the proxy to NFTUpgradeToV4Module", async function () {
            const { ethers, networkName } = await hre.network.connect()
            console.info(`NMCToken Proxy networkName: ${networkName}`)
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { implementation, proxy, nmcTokenV4Proxy } = await connect.ignition.deploy(NFTUpgradeToV4Module)
            console.info(`nmcToken v4 address: ${nmcTokenV4Proxy.target}`)
            const totalSupply = await nmcTokenV4Proxy.getTotalSupply()
            console.log(`nmcTokenV4Proxy totalSupply :${totalSupply}`)

            const totalSupplyV4 = await implementation.getTotalSupply()
            console.log(`implementation totalSupplyV4 :${totalSupplyV4}`)

            const configured = await nmcTokenV4Proxy.isV4Configured()
            console.log(`_v4Configured :${configured}`)

            const lastTimeStamp = await nmcTokenV4Proxy.getLastTimeStamp()
            const formattedDate = new Date(Number(lastTimeStamp) * 1000).toLocaleString()
            console.log(`lastTimeStamp :${lastTimeStamp} (${formattedDate})`)
        })
    })
})
