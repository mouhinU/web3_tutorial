import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

import CounterModule from "./ProxyModule.js"

const UpgradeModule = buildModule("UpgradeModule", (m) => {
  const proxyAdminOwner = m.getAccount(0)
  const { proxyAdmin, proxy } = m.useModule(CounterModule)
  const counter = m.contract("CounterV2")
  const encodedFunctionCall = m.encodeFunctionCall(counter, "setName", ["Example Name"])
  m.call(proxyAdmin, "upgradeAndCall", [proxy, counter, encodedFunctionCall], {
    from: proxyAdminOwner,
  })
  // return { proxyAdmin, proxy }
  return { proxyAdmin, proxy, counter }
})

export default UpgradeModule
