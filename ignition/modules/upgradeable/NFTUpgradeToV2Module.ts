import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import NMCTokenToV1Module from "./NFTProxyModule.js"

const NFTUpgradeToV2Module = buildModule("NFTUpgradeToV2Module", (m) => {
    // 获取所有者账户（应该是原来的部署者）
    const owner = m.getAccount(0)
    // 1. 获取proxy ,proxyAdmin 合约实例
    const { proxy, proxyAdmin } = m.useModule(NMCTokenToV1Module)

    // 2. 部署新的 V2 实现合约
    const nmcTokenV2 = m.contract("NMCTokenV2", [], {
        id: "NMCTokenV2",
    })

    // 3. 升级代理
    m.call(proxyAdmin, "upgradeAndCall", [proxy, nmcTokenV2, "0x"], {
        from: owner,
        id: "UpgradeProxyToV2",
    })

    // 4. 获取升级后的代理接口
    const nmcTokenProxy = m.contractAt("NMCTokenV2", proxy, {
        id: "UpgradedNMCToken",
    })

    // 5. 初始化 V2 功能
    m.call(nmcTokenProxy, "initializeV2", [], {
        from: owner,
        id: "InitializeV2Features",
    })

    return { proxy, proxyAdmin, nmcTokenProxy }
})

export default NFTUpgradeToV2Module

// const NFTUpgradeToV2Module = buildModule("NFTUpgradeToV2Module", (m) => {
//     // 使用已有的代理模块
//     const { proxyAdmin, proxy } = m.useModule(NMCTokenToV1Module)

//     // 获取代理合约的所有者 - 在初始部署中，这是 proxyAdminOwner
//     const proxyAdminOwner = m.getAccount(0)

//     // 部署 V2 实现合约
//     const nmcTokenV2 = m.contract("NMCTokenV2", [], {
//         id: "NMCTokenV2",
//     })

//     // 第一步：升级到V2实现合约，不传初始化数据
//     m.call(proxyAdmin, "upgradeAndCall", [proxy, nmcTokenV2, "0x"], {
//         from: proxyAdminOwner,
//         id: "UpgradeToV2",
//     })

//     // 创建升级后的代理合约实例
//     const nmcTokenV2Proxy = m.contractAt("NMCTokenV2", proxy, {
//         id: "NMCTokenV2Proxy",
//     })

//     // 第二步：通过代理合约直接调用 initializeV2
//     // 关键：proxyOwner 必须是代理合约的所有者
//     m.call(nmcTokenV2Proxy, "initializeV2", [], {
//         from: "0x0000000000000000000000000000000000000000",
//         id: "InitializeV2",
//     })

//     return { proxyAdmin, proxy, nmcToken: nmcTokenV2Proxy }
// })

// export default NFTUpgradeToV2Module
