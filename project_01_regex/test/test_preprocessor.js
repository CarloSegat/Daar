const assert = require('assert')
const { preprocess } = require('../src/preprocessor')
assert(preprocess(".").slice(0, 8) === "(a|b|c|d")
let preprocess1 = preprocess(".*")
assert(preprocess1.slice(preprocess1.length - 2, preprocess1.length) === ")*")