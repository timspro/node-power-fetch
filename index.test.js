import { autotest } from "@tim-code/autotest"
import { fetchFactoryGet, fetchFactoryPost } from "./index.js"

autotest(fetchFactoryGet(), { name: "getFactory" })("https://httpbin.org/get")(
  expect.objectContaining({ args: {} })
)

const getInput = { test: "1" }
autotest(fetchFactoryGet(), { name: "getFactory" })("https://httpbin.org/get", getInput)(
  expect.objectContaining({ args: getInput })
)

const postInput = { check: 1 }
autotest(fetchFactoryPost(), { name: "postFactory" })("https://httpbin.org/post", postInput)(
  expect.objectContaining({ json: postInput })
)
