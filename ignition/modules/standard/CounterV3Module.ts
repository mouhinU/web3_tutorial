// V3 交互（新增）
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import UpgradeToV3Module from "./UpgradeToV3Module.js"

const CounterV3Module = buildModule("CounterV3Module", (m) => {
  // 使用 UpgradeToV3Module 部署透明可升级代理和 ProxyAdmin
  const { proxy, proxyAdmin } = m.useModule(UpgradeToV3Module)
  // 获取代理合约的 V3 接口
  const counter = m.contractAt("CounterV3", proxy, {
    id: "CounterV3Proxy",
  })
  return { counter, proxy, proxyAdmin }
})

export default CounterV3Module
