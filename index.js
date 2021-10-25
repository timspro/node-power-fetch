import { get, jsonFetch, post } from "@tim-code/json-fetch"
import nodeFetch from "node-fetch"
import { fetchBuilder, FileSystemCache } from "node-fetch-cache"
import { pRateLimit } from "p-ratelimit"

// concurrency needs to be at least 2 for server tests to pass
const defaultLimitOptions = {
  interval: 1000 * 10,
  rate: 120,
  concurrency: 6,
}
// only limit request if they are not cached
class LimitedCache extends FileSystemCache {
  constructor({ limit, ...options } = {}) {
    super(options)
    if (limit) {
      const limitOptions = typeof limit === "object" ? limit : {}
      this.limiter = pRateLimit({ ...defaultLimitOptions, limitOptions })
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
  let fetch = nodeFetch
  if (cache || limit) {
    const cacheOptions = cache && typeof cache === "object" ? cache : {}
    if (!cache) {
      cacheOptions.ttl = 0
    }
    fetch = fetchBuilder.withCache(
      new LimitedCache({ ...defaultCacheOptions, ...cacheOptions, limit })
    )
  }
  return fetch
}

export function jsonFetchFactory({ cache = true, limit = true, ...fetchOptions } = {}) {
  const fetch = fetchFactory({ cache, limit })
  return (url, options = {}) => jsonFetch(url, { ...fetchOptions, options, fetch })
}

export function getFetchFactory({ cache = true, limit = true, ...fetchOptions } = {}) {
  const fetch = fetchFactory({ cache, limit })
  return (url, query, options = {}) => get(url, query, { ...fetchOptions, options, fetch })
}

export function postFetchFactory({ cache = true, limit = true, ...fetchOptions } = {}) {
  const fetch = fetchFactory({ cache, limit })
  return (url, body, options = {}) => post(url, body, { ...fetchOptions, options, fetch })
}
