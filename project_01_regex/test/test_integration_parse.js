const assert = require("assert");
const { parseSymbols, parseAsterisks, parseConcatenation, parseUnion } = require('../src/syntaxTree')


function parse_all(s) {
  let step_1 = parseSymbols(s, 0)
  let step_2 = parseAsterisks(step_1, 0)
  let step_3 = parseConcatenation(step_2, 0, [])
  let step_4 = parseUnion(step_3, 0)
  return step_4
}

let s = "a*(a|b)t*|a|q|(a|b)*"
let step_4 = parse_all(s)
assert(step_4 === "(((((((a)*).((a)|(b))).((t)*))|(a))|(q))|(((a)|(b))*))")



s = "a*|(a|b)*"
step_4 = parse_all(s)
assert(step_4 === "(((a)*)|(((a)|(b))*))")

s = "abc"
step_4 = parse_all(s)
assert(step_4 === "(((a).(b)).(c))")



