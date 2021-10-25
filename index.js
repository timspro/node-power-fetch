import * as json from "@tim-code/json-fetch"
import nodeFetch from "node-fetch"
import { fetchBuilder, FileSystemCache } from "node-fetch-cache"
import { pRateLimit } from "p-ratelimit"

// concurrency needs to be at least 2 for server tests to pass
const defaultLimitOptions = {
  interval: 1000 * 10,
  rate: 120,
  concurrency: 6,
}
function createLimiter(limitOptions) {
  limitOptions = typeof limitOptions === "object" ? limitOptions : {}
  return pRateLimit({ ...defaultLimitOptions, limitOptions })
}

// only limit request if they are not cached
class LimitedCache extends FileSystemCache {
  constructor({ limit, ...options } = {}) {
    super(options)
    if (limit) {
      this.limiter = createLimiter(limit)
    }
  }

  async get(key) {
    const result = await super.get(key)
    // if the cache returns undefined, we know that a request will be made to the server...
    if (this.limiter && result === undefined) {
      // ...so we can limit here while we are still returning from the cache
      return this.limiter(() => Promise.resolve(undefined))
    }
    return result
  }
}

const defaultCacheOptions = {
  cacheDirectory: `./cache`,
  ttl: 15 * 60 * 1000,
}
function fetchFactory({ cache, limit } = {}) {
  if (cache) {
    const cacheOptions = cache && typeof cache === "object" ? cache : {}
    return fetchBuilder.withCache(
      new LimitedCache({ ...defaultCacheOptions, ...cacheOptions, limit })
    )
  } else if (limit) {
    const limiter = createLimiter(limit)
    return (...args) => limiter(() => nodeFetch(...args))
  }
  return nodeFetch
}

export function powerFetchFactory({ cache = true, limit = true, ...fetchOptions } = {}) {
  const fetch = fetchFactory({ cache, limit })
  return (url, { query, body, ...options } = {}) => {
    options = { ...fetchOptions, options, fetch }
    if (body) {
      url = json.appendQueryParams(url, query)
      return json.post(url, body, options)
    }
    return json.get(url, query, options)
  }
}
