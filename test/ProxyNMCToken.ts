import hre from "hardhat"
import { assert, expect } from "chai"

import NMCTokenToV1Module from "../ignition/modules/upgradeable/NFTProxyModule.js"

import NFTUpgradeToV2Module from "../ignition/modules/upgradeable/NFTUpgradeToV2Module.js"

const { ethers, networkName } = await hre.network.connect()
console.info(`NMCToken Proxy networkName: ${networkName}`)
describe("NMCToken Proxy", async function () {
    describe("NMCToken Proxy interaction", function () {
        it("NMCToken Should be usable via proxy", async function () {
            // const accounts = await ethers.getSigners()
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

    describe("Check current ownership", function () {
        it("Should check who is the current owner", async function () {
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            // Get the proxy contract instance
            const nmcTokenProxy = await ethers.getContractAt("NMCTokenV2", "0x111d8F457f6A53888c10eAC5e5ff88190ba6bf29")

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

    describe("Upgrading to V2 NMCTokenToV2Module", function () {
        it("transferOwnership to otherAccount", async function () {
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const [, otherAccount] = await ethers.getSigners()
            const nmcTokenProxy = await ethers.getContractAt("NMCTokenV2", "0xe6Aa573787De66e26A2808cfb5874C8d9c9183e1")
            const tx = await nmcTokenProxy.transferOwnership(accounts[0]?.address)
            const txReceipt = await tx.wait()
            console.log(txReceipt)
        })

        it("Should have upgraded the proxy to NMCTokenToV2Module", async function () {
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, nmcTokenProxy } = await connect.ignition.deploy(NFTUpgradeToV2Module)
            console.info(`nmcToken v2 address: ${nmcTokenProxy.target}`)
            const totalSupply = await nmcTokenProxy.getTotalSupply()
            console.log(`totalSupply :${totalSupply}`)
            const tx = await nmcTokenProxy.setMaxSupply(20000)
            const txReceipt = await tx.wait()
            console.log(txReceipt)
            const newTotalSupply = await nmcTokenProxy.getTotalSupply()
            console.log(`newTotalSupply :${newTotalSupply}`)
        })
    })
})
