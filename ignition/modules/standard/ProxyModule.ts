import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

//  初始代理部署
const proxyModule = buildModule("ProxyModule", (m) => {
  // 获取第一个账户作为代理管理员所有者
  const proxyAdminOwner = m.getAccount(0)
  // 部署初始实现合约 Counter
  const counter = m.contract("Counter")

  // 部署透明可升级代理，参数：
  // - counter: 初始实现合约地址
  // - proxyAdminOwner: 代理管理员所有者
  // - "0x": 空初始化数据
  const proxy = m.contract("TransparentUpgradeableProxy", [counter, proxyAdminOwner, "0x"])
  // 从代理部署事件中读取 ProxyAdmin 地址
  // - proxy: 部署的透明可升级代理合约实例
  // - "AdminChanged": 事件名称
  // - "newAdmin": 事件中记录的新管理员地址
  const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin")
  // 通过地址获取 ProxyAdmin 合约实例
  // - "ProxyAdmin": 合约名称
  // - proxyAdminAddress: 从事件中读取的 ProxyAdmin 地址
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress)
  // 返回 ProxyAdmin 合约实例和透明可升级代理合约实例

  return { proxyAdmin, proxy }
})

const CounterV1Module = buildModule("CounterV1Module", (m) => {
  // 使用 ProxyModule 部署透明可升级代理和 ProxyAdmin
  const { proxy, proxyAdmin } = m.useModule(proxyModule)
  // 获取透明可升级代理合约的 Counter 接口
  const counter = m.contractAt("Counter", proxy, {
    id: "CounterProxy",
  })

  // 返回 Counter 合约实例、透明可升级代理合约实例和 ProxyAdmin 合约实例
  return { counter, proxy, proxyAdmin }
})

export default CounterV1Module
