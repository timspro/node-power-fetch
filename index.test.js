import { autotest } from "@tim-code/autotest"
import { getFactory, postFactory } from "./index.js"

autotest(getFactory(), { name: "getFactory" })("https://httpbin.org/get")(
  expect.objectContaining({ args: {} })
)

const getInput = { test: "1" }
autotest(getFactory(), { name: "getFactory" })("https://httpbin.org/get", getInput)(
  expect.objectContaining({ args: getInput })
)

const postInput = { check: 1 }
autotest(postFactory(), { name: "postFactory" })("https://httpbin.org/post", postInput)(
  expect.objectContaining({ json: postInput })
)
