import { formatUnits } from "viem"
import cache from "./lru-cache"
import client from "./covalent-client"

async function getAllHoldersOpSecBalance() {
  const cachedData = cache.get("holders_opsec_balance")

  if (cachedData !== undefined) {
    return cachedData
  }
  try {
    let sum: number = 0
    for await (const resp of client.BalanceService.getTokenHoldersV2ForTokenAddress(
      process.env.NODE_ENV === "production" ? "eth-mainnet" : "eth-sepolia",
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
      { pageSize: 1000 },
    )) {
      sum =
        sum +
        Number(formatUnits(resp.balance as bigint, resp.contract_decimals))
    }
    cache.set("holders_opsec_balance", sum)
    return sum
  } catch (error) {
    console.error("Error fetching All Holders balance:", error)
    throw error
  }
}

export default getAllHoldersOpSecBalance
