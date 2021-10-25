import { autotest } from "@tim-code/autotest"
import { powerFetchFactory } from "./index.js"

autotest(powerFetchFactory(), { name: "getFactory" })("https://httpbin.org/get")(
  expect.objectContaining({ args: {} })
)

const getInput = { query: { test: "1" } }
autotest(powerFetchFactory(), { name: "getFactory args" })(
  "https://httpbin.org/get",
  getInput
)(expect.objectContaining({ args: getInput.query }))

const postInput = { body: { check: 1 } }
autotest(powerFetchFactory(), { name: "postFactory" })("https://httpbin.org/post", postInput)(
  expect.objectContaining({ json: postInput.body })
)

autotest(powerFetchFactory({ cache: false }), { name: "getFactory no cache" })(
  "https://httpbin.org/get"
)(expect.objectContaining({ args: {} }))

const selectorInput = { selector: "$.json.check" }
autotest(powerFetchFactory(), { name: "post selector" })("https://httpbin.org/post", {
  ...postInput,
  ...selectorInput,
})([1])
