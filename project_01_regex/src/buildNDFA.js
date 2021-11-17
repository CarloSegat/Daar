const assert = require('assert')
const { indexOfClose } = require('./utils')
const { makeSignleSymbolNDFA } = require('./ndfa')

function buildNFARecursively(string){
  assert(string[0] === "(" && string[string.length - 1] === ")")
  if(string[1] !== "("){
    return makeSignleSymbolNDFA(string[1])
  }
  assert(string[1] === "(")
  let dex = indexOfClose(1, string)
  if(string[dex+1] === ")"){
    // redundant parenthesis
    let newString = string.slice(1, string.length - 1)
    return buildNFARecursively(newString)
  }
  if(string[dex+1] === "."){
    let left = buildNFARecursively(string.slice(1, dex+1))
    let right = buildNFARecursively(string.slice(dex+2, string.length))
    return left.applyConcatenation(right)
  }
  if(string[dex+1] === "|"){
    let left = buildNFARecursively(string.slice(1, dex+1))
    let right = buildNFARecursively(string.slice(dex+2, string.length))
    return left.applyUnion(right)
  }
  if(string[dex+1] === "*"){
    let v = buildNFARecursively(string.slice(1, dex+1))
    return v.applyClosure()
  }
}

module.exports = buildNFARecursively