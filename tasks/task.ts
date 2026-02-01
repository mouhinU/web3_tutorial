import { task } from "hardhat/config"

task("accounts", "Print the accounts").setAction(async () => {
  const { provider } = await hre.network.connect()
  console.log(await provider.request({ method: "eth_accounts" }))
})
