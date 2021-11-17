const { concatenationSymbol, indexOfOpen, indexOfClose } = require('./utils')

function parseSymbols(string, i, realSymbolCount){
  if(i === string.length){
    if(realSymbolCount === 0){
      throw "The regex we were trying to build a syntax tree for has ZERO REAL SYMBOLS, it's malformed"
    }
    return string
  }
  if(string[i] !== '(' && string[i] !== ')' && string[i] !== '*' && string[i] !== '|') {
    realSymbolCount++;
    let newString = string.slice(0, i) + "(" + string.slice(i, i+1) + ")" + string.slice(i + 1, string.length)
    return parseSymbols(newString, i + 3, realSymbolCount)
  }
  return parseSymbols(string, i+1, realSymbolCount)
}

function parseAsterisks(string, i){
  if(i === string.length){
    return string
  }

  if(string[i] === '*'){
    if(i !== string.length -1 && string[i+1] === ")") {
      return parseAsterisks(string, i+1)
    }
    if(string[i-1] === ")") {
      let dex = indexOfOpen(i - 1, string)
      let newString = string.slice(0, dex) + "(" + string.slice(dex, i+1) + ")" + string.slice(i+1, string.length)
      return parseAsterisks(newString, i+3)
    }
    let newString = string.slice(0, i-1) + "(" + string.slice(i-1, i+1) + ")" + string.slice(i+1, string.length)
    return parseAsterisks(newString, i+1)
  }
  return parseAsterisks(string, i+1)
}

function parseConcatenation(string, i, left_indices){
  if(i === string.length){
    return string
  }
  if(string[i] == "("){
    let dex = indexOfClose(i, string)
    if(dex !== string.length && string[dex+1] === '(' && left_indices.length === 0){
      return parseConcatenation(string, dex + 1, [i, dex])
    }
    if(left_indices.length > 0){
      let newString = string.slice(0, left_indices[0]) + "(" + string.slice(left_indices[0], left_indices[1]+1) + concatenationSymbol + string.slice(i, dex+1) + ")"
        + string.slice(dex+1, string.length)
      return parseConcatenation(newString, left_indices[0], [])
    }
  }
  // letters, |, *, )
  return parseConcatenation(string, i+1, [])
}

function parseUnion(string, i){
  if(i === string.length){
    return string
  }
  if(string[i] == "|"){
    let left = indexOfOpen(i - 1, string)
    let right = indexOfClose(i + 1, string)
    if(string[left - 1] === "(" && string[right + 1] === ")"){
      return parseUnion(string, i + 1)
    }
    let newString = string.slice(0, left) + "(" + string.slice(left, right + 1) + ")" + string.slice(right+1, string.length)
    return parseUnion(newString, i + 2)
  }

  // letters, |, *, )
  return parseUnion(string, i+1)
}

function parseRawRegex(string){
  let a = parseSymbols(string, 0, 0)
  a = parseAsterisks(a, 0)
  a = parseConcatenation(a, 0, [])
  a = parseUnion(a, 0)
  return a
}

module.exports = {
  parseSymbols,
  parseConcatenation,
  parseAsterisks,
  parseUnion,
  parseRawRegex}

