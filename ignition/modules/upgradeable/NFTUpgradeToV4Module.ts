import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import NFTUpgradeToV3Module from "./NFTUpgradeToV3Module.js"

/**
 * V3到V4升级模块
 * 将现有的透明代理从V3实现升级到V4 UUPS实现
 * 确保数据保持：所有存储在代理合约中的数据都会保留
 */
const NFTUpgradeToV4Module = buildModule("NFTUpgradeToV4Module", (m) => {
    // 获取部署者账户（必须是当前代理的所有者）
    const proxyAdminOwner = m.getAccount(0)

    // 从V3模块获取现有的代理和ProxyAdmin
    const { proxy, proxyAdmin } = m.useModule(NFTUpgradeToV3Module)

    // 部署新的V4实现合约（仅逻辑，不包含数据）
    const nmcTokenV4Implementation = m.contract("NMCTokenV4", [], {
        id: "NMCTokenV4_NewImplementation",
    })

    // 获取代理合约的接口实例（使用V4接口，因为升级后将指向V4实现）
    const nmcTokenProxy = m.contractAt("NMCTokenV4", proxy, {
        id: "NMCToken_Proxy_Instance",
        after: [nmcTokenV4Implementation], // 确保V4实现部署完成后再创建代理实例
    })

    // // 数据保持验证：在升级前检查关键数据
    // const totalSupplyCheck = m.staticCall(nmcTokenProxy, "getTotalSupply", [], {
    //     id: "CheckTotalSupplyBeforeUpgrade",
    //     from: deployer,
    // })

    // 注意：从透明代理升级到UUPS，需要使用ProxyAdmin的upgradeAndCall
    // 这是关键步骤，确保从透明代理模式转换到UUPS模式
    const upgradeCall = m.call(proxyAdmin, "upgradeAndCall", [proxy, nmcTokenV4Implementation, "0x"], {
        id: "UpgradeToV4Implementation",
        from: proxyAdminOwner,
        // after: [totalSupplyCheck], // 确保在数据检查之后执行
    })

    // 初始化V4功能（仅初始化V4新增的功能，不影响历史数据）
    // 注意：initializeV4使用reinitializer(4)，只能调用一次
    const initializeCall = m.call(nmcTokenProxy, "initializeV4", [], {
        id: "InitializeV4Features",
        from: proxyAdminOwner,
        after: [upgradeCall], // 确保升级完成后再初始化
    })

    return {
        newImplementation: nmcTokenV4Implementation,
        proxy: nmcTokenProxy,
        proxyAdmin,
    }
})
export default NFTUpgradeToV4Module
