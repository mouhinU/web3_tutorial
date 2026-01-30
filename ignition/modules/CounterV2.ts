import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

import UpgradeModule from "./UpgradeModule.js"

const counterV2Module = buildModule("CounterV2Module", (m) => {
  const { proxy } = m.useModule(UpgradeModule)
  const counterV2 = m.contractAt("CounterV2", proxy)
  return { counterV2 }
})

export default counterV2Module
