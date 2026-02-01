//# V2 -> V3 升级（新增）
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import CounterV2Module from "./CounterV2Module.js"

const UpgradeToV3Module = buildModule("UpgradeToV3Module", (m) => {
  const proxyAdminOwner = m.getAccount(0)
  const { proxyAdmin, proxy } = m.useModule(CounterV2Module)
  // 部署 CounterV3
  const counterV3 = m.contract("CounterV3")
  // 编码初始化调用（如果需要）
  const encodedFunctionCall = m.encodeFunctionCall(counterV3, "setName", ["V3 Name"])
  // 使用 upgradeAndCall 进行升级和初始化
  m.call(proxyAdmin, "upgradeAndCall", [proxy, counterV3, encodedFunctionCall], {
    from: proxyAdminOwner,
    id: "upgradeToV3",
  })
  // return { proxyAdmin, proxy }
  const counterV3Proxy = m.contractAt("CounterV3", proxy, {
    id: "CounterV3Proxy",
  })
  return { proxyAdmin, proxy, counter: counterV3Proxy }
})

// const UpgradeToV3Module = buildModule("UpgradeToV3Module", (m) => {
//   const proxyAdminOwner = m.getAccount(0)

//   // 使用已有的代理模块
//   const { proxyAdmin, proxy } = m.useModule(CounterV2Module)
//   // 部署 CounterV3 实现合约
//   const counter = m.contract("CounterV3")
//   // 升级代理到 V3
//   m.call(proxyAdmin, "upgrade", [proxy, counter], {
//     from: proxyAdminOwner,
//   })
//   // 如果需要初始化 V3 的特定状态（比如设置 name）
//   const encodedFunctionCall = m.encodeFunctionCall(counter, "setName", ["V3 Name"])
//   m.call(proxyAdmin, "upgradeAndCall", [proxy, counter, encodedFunctionCall], {
//     from: proxyAdminOwner,
//   })
//   这里的counter 是对应的实例对象
//   return { proxyAdmin, proxy, counter }
// })

export default UpgradeToV3Module

// UpgradeToV3Module.js
// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
// import CounterV2Module from "./CounterV2Module.js"

// export default UpgradeToV3Module
