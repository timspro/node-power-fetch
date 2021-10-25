import { autotest } from "@tim-code/autotest"
import { getFetchFactory, postFetchFactory } from "./index.js"

autotest(getFetchFactory(), { name: "getFactory" })("https://httpbin.org/get")(
  expect.objectContaining({ args: {} })
)

const getInput = { test: "1" }
autotest(getFetchFactory(), { name: "getFactory" })("https://httpbin.org/get", getInput)(
  expect.objectContaining({ args: getInput })
)

const postInput = { check: 1 }
autotest(postFetchFactory(), { name: "postFactory" })("https://httpbin.org/post", postInput)(
  expect.objectContaining({ json: postInput })
)
