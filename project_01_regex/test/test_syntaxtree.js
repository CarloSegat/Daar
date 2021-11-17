const assert = require("assert");
const { indexOfClose } = require('../src/utils')
const { parseRawRegex } = require('../src/syntaxTree')
const { parseSymbols, parseConcatenation, parseAsterisks, parseUnion } = require('../src/syntaxTree')

function test_find_closing_parenthesis() {
  assert(indexOfClose(0, '()') === 1)
  assert(indexOfClose(5, '01234(67)') === 8)
  assert(indexOfClose(0, '((ababab))') === 9)
  assert(indexOfClose(1, '((ababab))') === 8)
}


function test_enclose_asterisks() {
  assert(parseAsterisks('(a|b)*', 0) === '((a|b)*)')
  assert(parseAsterisks('(a|b)*q*', 0) === '((a|b)*)(q*)')
}

function test_parse_concatenation() {
  assert(parseConcatenation('(a)(b)', 0, []) === '((a).(b))')
  assert(parseConcatenation('(a)(b)(c)', 0, []) === '(((a).(b)).(c))')
  assert(parseConcatenation('(a)(b)|(c)', 0, []) === '((a).(b))|(c)')
  assert(parseConcatenation('(a)(b)|((c)*)((a)(b))', 0, []) === '((a).(b))|(((c)*).(((a).(b))))')
  assert(parseConcatenation('(c)(((a)(b)(c))*)', 0, []) === '((c).(((((a).(b)).(c)))*))')
}

function test_parse_symbols() {
  assert(parseSymbols('a', 0) === '(a)')
  assert(parseSymbols('abc', 0) === '(a)(b)(c)')
  assert(parseSymbols('abc|a*|ab', 0) === '(a)(b)(c)|(a)*|(a)(b)')
  assert(parseSymbols('(a|b)|abc', 0) === '((a)|(b))|(a)(b)(c)')
}

function test_parse_union() {
  let string = '(a)|(b)'
  assert(parseUnion(string, 0) === '(' + string + ')')
  string = '(a)|((b)|(c))'
  assert(parseUnion(string, 0) === '(' + string + ')')
  string = '(a)|((b)|(c))|(d)'
  assert(parseUnion(string, 0) === '(((a)|((b)|(c)))|(d))')
}

function test_parse_raw_regex(){
  assert(parseRawRegex("abc*") === "(((a).(b)).((c)*))")
}


test_find_closing_parenthesis()
test_enclose_asterisks()
test_parse_concatenation()
test_parse_symbols()
test_parse_union()
test_parse_raw_regex()
