import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import NFTUpgradeToV2Module from "./NFTUpgradeToV2Module.js"

// 升级代理合约到 V2 实现合约
const NFTUpgradeToV3Module = buildModule("NFTUpgradeToV3Module", (m) => {
    // 获取所有者账户（应该是原来的部署者）
    const proxyAdminOwner = m.getAccount(0)
    // 1. 获取proxy ,proxyAdmin 合约实例
    const { proxy, proxyAdmin } = m.useModule(NFTUpgradeToV2Module)
    // 2. 部署 V3 实现合约
    const NMCTokenV3 = m.contract("NMCTokenV3", [], {
        id: "NMCTokenV3",
    })
    // 3. 升级代理合约到 V3 实现合约
    m.call(proxyAdmin, "upgradeAndCall", [proxy, NMCTokenV3, "0x"], {
        from: proxyAdminOwner,
        id: "UpgradeProxyToV3",
    })
    // 4. 获取升级后的代理合约实例
    const nmcTokenProxy = m.contractAt("NMCTokenV3", proxy, {
        id: "UpgradedNMCTokenV3",
    })
    // 5. 通过升级后的代理合约实例,调用 V2 实现合约的初始化函数
    // 注意：这里需要从地址 "0x0000000000000000000000000000000000000000" 调用
    // 这是因为在升级时未传递初始化数据，所以需要通过代理合约直接调用
    try {
        m.call(
            nmcTokenProxy,
            "initializeV3",
            [
                /*这里是初始化方法的请求参数*/
            ],
            {
                from: proxyAdminOwner,
                id: "InitializeV3Features",
            },
        )
    } catch (error) {
        console.log("初始化 V3 特征失败:", error)
    }

    return { proxy, proxyAdmin, nmcTokenProxy }
})

export default NFTUpgradeToV3Module
