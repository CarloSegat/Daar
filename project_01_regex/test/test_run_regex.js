const assert = require('assert')
const { runRegex } = require('../src/runRegex')

let testText = "this is\nan example, a short example to be precise, of a text that\nwe may see.\n--- contains ; randomdomdom 1234"
// runMain(testRegex, testText)
assert(runRegex('this', testText)[0] === "this is")
assert(runRegex('an', testText)[0] === "an example, a short example to be precise, of a text that")
assert(runRegex('s.*t', testText)[0] === "an example, a short example to be precise, of a text that")
assert(runRegex('th.s|e(x|a|m|p|l|e)*', testText)[1] === "an example, a short example to be precise, of a text that")
assert(runRegex('th.s|e(x|a|m|p|l|e)*', testText)[0] === "this is")
assert(runRegex('e(x|a|m|p|l|e)*|th.s', testText)[0] === "this is")

function assertMalformedREgexThrowsException(malformedRegex) {
  let passing = true
  try {
    runRegex(malformedRegex, testText)
    passing = false
  } catch(e){
  } finally {
    assert(passing, `The regex ${malformedRegex} is malformed and it should not pass`)
  }
}

assertMalformedREgexThrowsException('*')
assertMalformedREgexThrowsException('|')
assertMalformedREgexThrowsException('*|*')
assertMalformedREgexThrowsException('||**')
assertMalformedREgexThrowsException('')

assert(runRegex('ran(dom)*', testText)[0] === "--- contains ; randomdomdom 1234")
assert(runRegex('.*(dom)*', testText).length === 4)
