const { makeSignleSymbolNDFA } = require('../src/ndfa')

function make_a_ndfa() {
  return makeSignleSymbolNDFA('a')
}
function make_b_ndfa() {
  return makeSignleSymbolNDFA('b')
}

let ndfaA = make_a_ndfa()
ndfaA.getInitial()
ndfaA.getAccepting()

ndfaA = make_a_ndfa()
let closure = ndfaA.applyClosure()

ndfaA = make_a_ndfa()
let ndfaB = make_b_ndfa()
let ndfaAB = ndfaA.applyConcatenation(ndfaB)

ndfaA = make_a_ndfa()
ndfaB = make_b_ndfa()
let ndfaBA = ndfaB.applyConcatenation(ndfaA)


ndfaA = make_a_ndfa()
ndfaB = make_b_ndfa()
let ndfaB_u_A = ndfaB.applyUnion(ndfaA)