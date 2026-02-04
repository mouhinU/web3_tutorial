import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import NMCTokenToV1Module from "./NFTProxyToV1Module.js"

// 升级代理合约到 V2 实现合约
const NFTUpgradeToV2Module = buildModule("NFTUpgradeToV2Module", (m) => {
    // 获取所有者账户（应该是原来的部署者）
    const proxyAdminOwner = m.getAccount(0)
    // 1. 获取proxy ,proxyAdmin 合约实例
    const { proxy, proxyAdmin } = m.useModule(NMCTokenToV1Module)
    // 2. 部署 V2 实现合约
    const nmcTokenV2 = m.contract("NMCTokenV2", [], {
        id: "NMCTokenV2",
    })
    // 3. 升级代理合约到 V2 实现合约
    const upgradeCall = m.call(proxyAdmin, "upgradeAndCall", [proxy, nmcTokenV2, "0x"], {
        from: proxyAdminOwner,
        id: "UpgradeProxyToV2",
    })
    // 4. 获取升级后的代理合约实例
    const nmcTokenProxy = m.contractAt("NMCTokenV2", proxy, {
        id: "UpgradedNMCTokenV2",
        // Ensure this happens after the upgrade call
        after: [upgradeCall],
    })
    // 5. 通过升级后的代理合约实例,调用 V2 实现合约的初始化函数
    // 注意：这里需要从地址 "0x0000000000000000000000000000000000000000" 调用
    // 这是因为在升级时未传递初始化数据，所以需要通过代理合约直接调用
    m.call(
        nmcTokenProxy,
        "initializeV2",
        [
            /*这里是初始化方法的请求参数*/
        ],
        {
            from: proxyAdminOwner,
            id: "InitializeV2Features",
            // Ensure initialization happens after proxy is created
            after: [nmcTokenProxy],
        },
    )
    return { proxy, proxyAdmin, nmcTokenProxy }
})

export default NFTUpgradeToV2Module
