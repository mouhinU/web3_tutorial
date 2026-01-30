import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const proxyModule = buildModule("ProxyModule", (m) => {
  const proxyAdminOwner = m.getAccount(0)
  const counter = m.contract("Counter")
  const proxy = m.contract("TransparentUpgradeableProxy", [counter, proxyAdminOwner, "0x"])
  const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin")
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress)

  return { proxyAdmin, proxy }
})

const CounterModule = buildModule("CounterModule", (m) => {
  const { proxy, proxyAdmin } = m.useModule(proxyModule)
  const counter = m.contractAt("Counter", proxy)
  return { counter, proxy, proxyAdmin }
})

export default CounterModule
