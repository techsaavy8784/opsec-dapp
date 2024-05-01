import cache from "./lruCache"

const getPriceETH = (): number => {
  const cachedRatio = cache.get("eth_usd_ratio")

  if (cachedRatio !== undefined) {
    return cachedRatio
  }
  try {
    const response = await fetch(
      "https://api.coinbase.com/v2/prices/ETH-USD/spot",
    ).then((res) => res.json())

    const usdSpotPrice = response.data.amount

    cache.set("eth_usd_ratio", usdSpotPrice)

    return usdSpotPrice
  } catch (error) {
    console.error("Error fetching ETH-USD spot price:", error)
    throw error
  }
}

export default getPriceETH
