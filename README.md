# json-fetch

```
npm install @tim-code/node-power-fetch
```

A fetch wrapper for HTTP/HTTPS requests that should return well-formed JSON with caching and limiting

## Philosophy

```js
import { powerFetchFactory } from "@tim-code/node-power-fetch"
const powerFetch = powerFetchFactory({ cache: true, limit: true }) //default
powerFetch(url, { ...fetchOptions, query: { a: "b" }, body: { c: "d" } })
```

Instead of `true`, it is possible to pass an options object for either `cache` (see `FileSystemCache` in https://www.npmjs.com/package/node-fetch-cache) or `limit` (https://www.npmjs.com/package/p-ratelimit). Passing `false` will disable that feature.

## Special Parameters to powerFetch()

`selector`: a JSON path selector to apply to the result; always produces an array (https://www.npmjs.com/package/jsonpath)

The following come from https://www.npmjs.com/package/@tim-code/json-fetch:

`query`: appends the object value to the query string of the URL

`body`: stringifies and sets headers to post the object value

`onError`: replace error behavior
