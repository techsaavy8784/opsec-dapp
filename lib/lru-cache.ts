import { LRUCache } from "lru-cache"

const options = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value: any, key: any) => {
    return 1
  },

  // how long to live in ms
  ttl: 1000 * 60 * 5,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
}
// Create an LRU cache with a TTL of 5 minutes (300 seconds)
const cache = new LRUCache(options)

export default cache
