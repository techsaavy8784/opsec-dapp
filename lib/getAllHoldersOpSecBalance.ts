import { formatUnits } from "viem"
import cache from "./lruCache"
import client from "./covalentClient"

async function getAllHoldersOpSecBalance() {
  const cachedData = cache.get("holders_opsec_balance")

  console.log("cached---> ", cachedData)

  if (cachedData !== undefined) {
    return cachedData
  }
  try {
    let sum: number = 0
    for await (const resp of client.BalanceService.getTokenHoldersV2ForTokenAddress(
      "eth-mainnet",
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
      { pageSize: 1000 },
    )) {
      sum =
        sum +
        Number(formatUnits(resp.balance as bigint, resp.contract_decimals))
    }
    return sum
  } catch (error) {
    console.error("Error fetching All Holders balance:", error)
    throw error
  }
}

export default getAllHoldersOpSecBalance
