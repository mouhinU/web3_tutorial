import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

// UUPS代理部署模块
const NFTUpgradeToV4Module = buildModule("NFTUpgradeToV4Module", (m) => {
    // 获取第一个账户作为部署者
    const deployer = m.getAccount(0)

    // 部署实现合约（NMCTokenV4）
    const nmcTokenV4 = m.contract("NMCTokenV4", [], {
        id: "NMCTokenV4_Implementation",
    })

    // 部署ERC1967代理合约
    // UUPS使用ERC1967Proxy，构造函数参数：
    // 1. 实现合约地址
    // 2. 初始化调用数据
    const encodedInitialize = m.encodeFunctionCall(nmcTokenV4, "initializeV4", [])

    const proxy = m.contract("ERC1967Proxy", [nmcTokenV4, encodedInitialize], {
        id: "NMCTokenV4_Proxy",
    })

    // 获取代理合约的NMCTokenV4接口实例
    const nmcTokenV4Proxy = m.contractAt("NMCTokenV4", proxy, {
        id: "NMCTokenV4_Proxy_Instance",
    })

    return {
        implementation: nmcTokenV4,
        proxy,
        nmcTokenV4Proxy,
    }
})
export default NFTUpgradeToV4Module
