import axios from "axios"
import cache from "./lruCache"

async function getPriceETH() {
  const cachedRatio = cache.get("eth_usd_ratio")

  if (cachedRatio !== undefined) {
    return cachedRatio
  }
  try {
    const response = await axios.get(
      "https://api.coinbase.com/v2/prices/ETH-USD/spot",
    )

    const usdSpotPrice = response.data.data.amount

    cache.set("eth_usd_ratio", usdSpotPrice)

    return usdSpotPrice
  } catch (error) {
    console.error("Error fetching ETH-USD spot price:", error)
    throw error
  }
}

export default getPriceETH
