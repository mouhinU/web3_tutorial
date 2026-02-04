import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

//  初始代理部署
const NFTProxyToV1Module = buildModule("NFTProxyToV1Module", (m) => {
    // 获取第一个账户作为代理管理员所有者
    const proxyAdminOwner = m.getAccount(0)
    // 部署初始实现合约 `NMCToken`
    const nmcToken = m.contract("NMCToken", ["NMCToken", "NMC"], { id: "NMCToken" })
    // 编码初始化函数调用，参数：
    // - nmcToken: 初始实现合约实例
    // - "initialize": 初始化函数名称
    // - [proxyAdminOwner]: 初始化函数参数，代理管理员所有者
    const encodedInitialize = m.encodeFunctionCall(nmcToken, "initialize", [proxyAdminOwner])
    // 部署透明可升级代理，参数：
    // - nmcToken: 初始实现合约地址
    // - proxyAdminOwner: 代理管理员所有者
    // - "0x": 空初始化数据
    // const proxy = m.contract("TransparentUpgradeableProxy", [nmcToken, proxyAdminOwner, "0x"])
    const proxy = m.contract("TransparentUpgradeableProxy", [nmcToken, proxyAdminOwner, encodedInitialize])
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

const NMCTokenToV1Module = buildModule("NMCTokenToV1Module", (m) => {
    // 使用 ProxyModule 部署透明可升级代理和 ProxyAdmin
    const { proxy, proxyAdmin } = m.useModule(NFTProxyToV1Module)
    // 获取透明可升级代理合约的 `NMCToken` 接口
    const nmcToken = m.contractAt("NMCToken", proxy, {
        id: "NMCTokenProxy",
    })
    // 返回 `NMCToken` 合约实例、透明可升级代理合约实例和 ProxyAdmin 合约实例
    return { nmcToken, proxy, proxyAdmin }
})

export default NMCTokenToV1Module

// const NFTProxyToV1Module = buildModule("NFTProxyToV1Module", ;(m) => {
//     // 获取第一个账户作为代理管理员所有者
//     const proxyAdminOwner = m.getAccount(0)
//     // 部署初始实现合约 `NMCToken`
//     const nmcToken = m.contract("NMCToken", ["NMCToken", "NMC"], { id: "NMCToken" })
//     // 编码初始化函数调用，参数：
//     // - nmcToken: 初始实现合约实例
//     // - "initialize": 初始化函数名称
//     // - [proxyAdminOwner]: 初始化函数参数，代理管理员所有者
//     const encodedInitialize = m.encodeFunctionCall(nmcToken, "initialize", [proxyAdminOwner])
//     // 部署透明可升级代理，参数：
//     // - nmcToken: 初始实现合约地址
//     // - proxyAdminOwner: 代理管理员所有者
//     // - "0x": 空初始化数据
//     // const proxy = m.contract("TransparentUpgradeableProxy", [nmcToken, proxyAdminOwner, "0x"])
//     const proxy = m.contract("TransparentUpgradeableProxy", [nmcToken, proxyAdminOwner, encodedInitialize])
//     // 从代理部署事件中读取 ProxyAdmin 地址
//     // - proxy: 部署的透明可升级代理合约实例
//     // - "AdminChanged": 事件名称
//     // - "newAdmin": 事件中记录的新管理员地址
//     const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin")
//     // 通过地址获取 ProxyAdmin 合约实例
//     // - "ProxyAdmin": 合约名称
//     // - proxyAdminAddress: 从事件中读取的 ProxyAdmin 地址
//     const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress)
//     // 返回 ProxyAdmin 合约实例和透明可升级代理合约实例

//     // 获取透明可升级代理合约的 `NMCToken` 接口
//     const nmcTokenProxy = m.contractAt("NMCToken", proxy, {
//         id: "NMCTokenProxy",
//     })

//     return { proxyAdmin, proxy ,nmcTokenProxy }
// })
