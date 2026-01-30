import hre from "hardhat"
import { assert, expect } from "chai"

import CounterModule from "../ignition/modules/ProxyModule.js"
import UpgradeModule from "../ignition/modules/UpgradeModule.js"

const { ethers, networkName } = await hre.network.connect()
console.info(`Counter Proxy networkName: ${networkName}`)
describe("Counter Proxy", async function () {
  describe("Proxy interaction", function () {
    it("Should be usable via proxy", async function () {
      // const accounts = await ethers.getSigners()
      const [, otherAccount] = await ethers.getSigners()
      // console.info(`otherAccount address: ${otherAccount.address}`)
      const connect = await hre.network.connect()
      const { counter } = await connect.ignition.deploy(CounterModule)
      console.info(`counter v1 address: ${counter.target}`)
      const version = await counter.version()
      console.info(version)
      const tx = await counter.inc()
      const txReceipt = await tx.wait()
      console.info(txReceipt)
    })
  })

  describe("Upgrading", function () {
    it("Should have upgraded the proxy to CounterV2", async function () {
      const accounts = await ethers.getSigners()
      const connect = await hre.network.connect()
      const { proxyAdmin, proxy, counter } = await connect.ignition.deploy(UpgradeModule)
      console.info(`counter v2 address: ${counter.target}`)
      const version = await counter.version()
      console.info(version)
      const tx = await counter.inc()
      const txReceipt = await tx.wait()
      const squareTx = await counter.square()
      const txReceipt2 = await squareTx.wait()
      console.info(txReceipt2)
    })

    //   it("Should have set the name during upgrade", async function () {
    //     const accounts = await ethers.getSigners()
    //     const connect = await hre.network.connect()
    //     const counter = await connect.ignition.deploy(UpgradeModule)
    //   })
  })
})
