import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

import UpgradeToV2Module from "./UpgradeToV2Module.js"

// # V2 交互
const CounterV2Module = buildModule("CounterV2Module", (m) => {
  // 获取透明可升级代理合约实例和 ProxyAdmin 合约实例
  const { proxyAdmin, proxy } = m.useModule(UpgradeToV2Module)
  // 获取 CounterV2 合约实例
  const counter = m.contractAt("CounterV2", proxy, {
    id: "CounterV2Proxy",
  })
  return { counter, proxyAdmin, proxy }
})

export default CounterV2Module
