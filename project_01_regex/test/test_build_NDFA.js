const build_NDFA = require('../src/buildNDFA')
const assert = require('assert')
const { LAMBDA } = require('../src/ndfa')

function isAcceptingReachableWithLambda(state, ndfa){
  if(state.charTransitions[LAMBDA] === undefined){
    return state.accepting
  }
  return state.accepting || state.charTransitions[LAMBDA].some(s => isAcceptingReachableWithLambda(ndfa.getStateById(s), ndfa))
}

function isAcceptingReachableWithLambdaAndSymbol(state, symbol, ndfa, visited){
  if(state.charTransitions[LAMBDA] === undefined && state.charTransitions[symbol] === undefined){
    return state.accepting
  }
  if(visited.includes(state.sid)){
    return state.accepting
  }
  return state.accepting ||
    (state.charTransitions[LAMBDA] || []).some(s => isAcceptingReachableWithLambdaAndSymbol(ndfa.getStateById(s), symbol, ndfa, [...visited, state.sid]))
    || (state.charTransitions[symbol] || []).some(s => isAcceptingReachableWithLambdaAndSymbol(ndfa.getStateById(s), symbol, ndfa, [...visited, state.sid]))
}

function test_closure_single_symbol() {
  let ndfa = build_NDFA('((a)*)')
  assert(ndfa.states.length === 4)
  assert(ndfa.getInitial().getAllTransitions()[LAMBDA].length === 2)
  assert(Object.keys(ndfa.getAccepting().getAllTransitions()).length === 0)
  assert(ndfa.getInitial().getReachableStates(LAMBDA).length === 2)
  assert(isAcceptingReachableWithLambda(ndfa.getInitial(), ndfa))
  assert(isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'a', ndfa, []))
}

function test_concatenation_and_union() {
  let ndfa = build_NDFA('(((a)*)|((a).(b)))')
  assert(ndfa.states.length === 10)
  assert(isAcceptingReachableWithLambda(ndfa.getInitial(), ndfa))
  assert(isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'a', ndfa, []))
}


function test_signle_symbol() {
  let ndfa = build_NDFA('(a)')
  assert(!isAcceptingReachableWithLambda(ndfa.getInitial(), ndfa))
  assert(isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'a', ndfa, []))
  assert(!isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'p', ndfa, []))
}

function test_union_single_symbols(){
  let ndfa = build_NDFA('(((a)|(b))|(c))')
  assert(!isAcceptingReachableWithLambda(ndfa.getInitial(), ndfa))
  assert(isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'a', ndfa, []))
  assert(isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'b', ndfa, []))
  assert(isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'c', ndfa, []))
  assert(! isAcceptingReachableWithLambdaAndSymbol(ndfa.getInitial(), 'e', ndfa, []))
}

test_signle_symbol()
test_concatenation_and_union()
test_closure_single_symbol()
test_union_single_symbols()
