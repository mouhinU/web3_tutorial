import { network } from "hardhat"

const { ethers } = await network.connect()
async function main() {
  //   const { ethers } = await network.connect({
  //   network: "hardhatOp",
  //   chainType: "op",
  // });
  console.log("Sending transaction using the OP chain type")
  const [sender] = await ethers.getSigners()
  const balance = await ethers.provider.getBalance(sender.address)
  console.log("Sender balance before transaction:", balance.toString())
  console.log("Sending 1 wei from", sender.address, "to itself")
  console.log("Sending L2 transaction")
  const tx = await sender.sendTransaction({
    to: sender.address,
    value: 1n,
  })

  const txReceipt = await tx.wait()
  console.log(txReceipt)
  const balanceAfter = await ethers.provider.getBalance(sender.address)
  console.log("Sender balance after transaction:", balanceAfter.toString())
  console.log("Transaction sent successfully")
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
