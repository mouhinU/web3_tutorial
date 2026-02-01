import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

import CounterV1Module from "./ProxyModule.js"

//  # V1 -> V2 升级
const UpgradeToV2Module = buildModule("UpgradeToV2Module", (m) => {
  // 获取第一个账户作为代理管理员所有者
  const proxyAdminOwner = m.getAccount(0)
  // 使用 CounterModule 部署透明可升级代理和 ProxyAdmin
  const { proxyAdmin, proxy } = m.useModule(CounterV1Module)
  // 获取 CounterV2 合约实例
  const counterV2 = m.contract("CounterV2")
  // 可选 : 编码 CounterV2 合约的 setName 函数调用，参数为 "Example Name"
  const encodedFunctionCall = m.encodeFunctionCall(counterV2, "setName", ["V2 Name"])
  // 调用 ProxyAdmin 合约的 upgradeAndCall 函数，升级透明可升级代理为 CounterV2 合约并调用 setName 函数
  m.call(proxyAdmin, "upgradeAndCall", [proxy, counterV2, encodedFunctionCall], {
    from: proxyAdminOwner,
    id: "upgradeToV2",
  })

  // return { proxyAdmin, proxy }
  // 在这里直接返回对应代理合约对象
  const counterV2Proxy = m.contractAt("CounterV2", proxy, {
    id: "CounterV2Proxy",
  })
  return { proxyAdmin, proxy, counter: counterV2Proxy }
})

export default UpgradeToV2Module
