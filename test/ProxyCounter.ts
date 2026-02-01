import hre from "hardhat"
import { assert, expect } from "chai"

import CounterToV1Module from "../ignition/modules/standard/ProxyModule.js"
import UpgradeToV2Module from "../ignition/modules/standard/UpgradeToV2Module.js"
import UpgradeToV3Module from "../ignition/modules/standard/UpgradeToV3Module.js"

import CounterV2Module from "../ignition/modules/standard/CounterV2Module.js"

const { ethers, networkName } = await hre.network.connect()
console.info(`Counter Proxy networkName: ${networkName}`)
describe("Counter Proxy", async function () {
    describe("Proxy interaction", function () {
        it("Should be usable via proxy", async function () {
            // const accounts = await ethers.getSigners()
            const [, otherAccount] = await ethers.getSigners()
            // console.info(`otherAccount address: ${otherAccount.address}`)
            const connect = await hre.network.connect()
            // 部署 CounterV1 合约并获取其透明可升级代理合约实例
            const { counter } = await connect.ignition.deploy(CounterToV1Module)
            console.info(`counter v1 Proxy address: ${counter.target}`)
            // 调用 CounterV1 合约的 version 函数获取合约版本
            const version = await counter.version()
            console.info(version)
            // 调用 CounterV1 合约的 inc 函数增加计数器值
            const tx = await counter.inc()
            const txReceipt = await tx.wait()
            // 调用 CounterV1 合约的 name 函数获取合约名称
            // const name = await counter.name()
            // console.info(`Should be usable via proxy ContractName: ${name}`)
        })
    })

    describe("Upgrading to V2 CounterV2Module", function () {
        it("Should have upgraded the proxy to CounterV2 CounterV2Module", async function () {
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, counter } = await connect.ignition.deploy(CounterV2Module)
            console.info(`counter v2 address: ${counter.target}`)
            const version = await counter.version()
            console.info(version)
            const tx = await counter.inc()
            const txReceipt = await tx.wait()
            const squareTx = await counter.square()
            const txReceipt2 = await squareTx.wait()
            console.info(txReceipt2)
            const name = await counter.name()
            console.info(`Upgrading to V2 name: ${name}`)
        })
    })

    describe("Upgrading to V2 UpgradeToV2Module", function () {
        it("Should have upgraded the proxy to CounterV2 UpgradeToV2Module", async function () {
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, counter } = await connect.ignition.deploy(UpgradeToV2Module)
            console.info(`counter v2 address: ${counter.target}`)
            const version = await counter.version()
            console.info(version)
            const tx = await counter.inc()
            const txReceipt = await tx.wait()
            const squareTx = await counter.square()
            const txReceipt2 = await squareTx.wait()
            console.info(txReceipt2)
            const name = await counter.name()
            console.info(`Upgrading to V2 name: ${name}`)
        })
    })

    describe("Upgrading to V3", function () {
        it("Should have upgraded the proxy to CounterV3", async function () {
            const accounts = await ethers.getSigners()
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, counter } = await connect.ignition.deploy(UpgradeToV3Module)
            console.info(`counter v3 address: ${counter.target}`)
            const version = await counter.version()
            console.info(version)
            const tx = await counter.inc()
            const txReceipt = await tx.wait()
            const squareTx = await counter.square()
            const txReceipt2 = await squareTx.wait()
            console.info(txReceipt2)
            const name = await counter.name()
            console.info(`Upgrading to V3 name: ${name}`)
        })

        it("Should have upgraded the proxy to CounterV3 and set the name", async function () {
            const connect = await hre.network.connect()
            const { proxyAdmin, proxy, counter } = await connect.ignition.deploy(UpgradeToV3Module)
            // 验证1: 检查部署的 CounterV3 地址
            console.info(`CounterV3 implementation address: ${counter.target}`)
            // 验证2: 检查代理当前的实现地址
            console.log(
                "ProxyAdmin methods:",
                proxyAdmin.interface.fragments.map((f: any) => f.name),
            )
            // https://eips.ethereum.org/EIPS/eip-1967
            // 地址 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
            // 是 EIP-1967 标准中定义的代理合约逻辑合约地址存储位置的 keccak256 哈希值（即 slot 0）
            const IMPLEMENTATION_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
            const storageValue = await ethers.provider.getStorage(proxy, IMPLEMENTATION_SLOT)
            console.info(`Storage value: ${storageValue}`)
            const currentImpl = ethers.getAddress("0x" + storageValue.slice(26))
            console.info(`Current implementation: ${currentImpl}`)
            const currentImpl2 = ethers.getAddress("0x" + storageValue.slice(-40))
            console.info(`Current implementation: ${currentImpl2}`)
            console.info(`Proxy address: ${proxy.target}`)

            console.info(`CounterV3 address: ${counter.target}`)

            // 验证4: 通过代理调用 V3 特有的方法
            // const counterV3 = await ethers.getContractAt("Counter", proxy)
            const version = await counter.version()
            console.info(`Version from proxy: ${version}`)

            const name = await counter.name()
            console.info(`Name from proxy: ${name}`)
        })

        it("Quick verification", async function () {
            const connect = await hre.network.connect()
            const result = await connect.ignition.deploy(UpgradeToV3Module)

            console.log("proxy:", result.proxy.target)
            console.log("counter.target:", result.counter.target)
            console.log("Are they the same?", result.proxy.target === result.counter.target)

            // 这才是正确的调用方式
            const correctCounter = await ethers.getContractAt("CounterV3", result.proxy.target)
            const name = await correctCounter.name()
            console.log("Real name from proxy:", name)
        })
    })
})
