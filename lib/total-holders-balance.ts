import { formatUnits } from "viem"
import client from "./covalent-client"

async function getAllHoldersOpsecBalance() {
  try {
    let sum: number = 0
    for await (const resp of client.BalanceService.getTokenHoldersV2ForTokenAddress(
      process.env.NODE_ENV === "production" ? "eth-mainnet" : "eth-sepolia",
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
      { pageSize: 1000 },
    )) {
      sum += Number(formatUnits(resp.balance as bigint, resp.contract_decimals))
    }
    return sum
  } catch (error) {
    console.error("Error fetching All Holders balance:", error)
    throw error
  }
}

export default getAllHoldersOpsecBalance
