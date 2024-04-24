import axios from "axios"
import { LRUCache } from "lru-cache"

const options = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value: any, key: any) => {
    return 1
  },

  // for use when you need to clean up something when objects
  // are evicted from the cache

  // dispose: (value, key) => {
  //   freeFromMemoryOrWhatever(value)
  // },

  // how long to live in ms
  ttl: 1000 * 60 * 5,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,

  // async method to use for cache.fetch(), for
  // stale-while-revalidate type of behavior

  // fetchMethod: async (
  //   key,
  //   staleValue,
  //   { options, signal, context }
  // ) => {},
}
// Create an LRU cache with a TTL of 5 minutes (300 seconds)
const cache = new LRUCache(options)

async function getPriceETH() {
  const cachedRatio = cache.get("eth_usd_ratio")
  if (cachedRatio !== undefined) {
    return cachedRatio
  }
  try {
    // Make a GET request to the Coinbase API endpoint for the current ETH-USD spot price
    const response = await axios.get(
      "https://api.coinbase.com/v2/prices/ETH-USD/spot",
    )

    // Extract the USD spot price from the response
    const usdSpotPrice = response.data.data.amount

    // Cache the ratio
    cache.set("eth_usd_ratio", usdSpotPrice)

    return usdSpotPrice
  } catch (error) {
    console.error("Error fetching ETH-USD spot price:", error)
    throw error
  }
}

export default getPriceETH
