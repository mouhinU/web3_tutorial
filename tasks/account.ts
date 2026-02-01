import { HardhatRuntimeEnvironment } from "hardhat/types/hre"
export default async function (taskArguments: any, hre: HardhatRuntimeEnvironment) {
  const { provider } = await hre.network.connect()
  console.log(await provider.request({ method: "eth_accounts" }))
}
