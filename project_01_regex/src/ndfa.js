const assert = require('assert')
const NDFARow = require('./ndfaRow')

const LAMBDA = Symbol('lambda')

class NDFA {
  constructor(...entries) {
    this.states = entries
  }
  addRow(ndfaRow){
    this.states.push(ndfaRow)
  }

  getAllStates(){
    return this.states
  }

  getStateById(id){
    let result = this.states.filter(e => e.sid === id);
    // console.log(">>> ", result)
    assert(result.length === 1);
    return result[0];
  }

  getInitial(){
    let result = this.states.filter(e => e.initial)
    assert(result.length === 1, "A NDFA must have exactly one initial state")
    return result[0]
  }

  getAccepting(){
    let result = this.states.filter(e => e.accepting)
    assert(result.length >= 1, "We deal with NDFA with exactly one accepting state")
    return result[0]
  }

  applyClosure(){

    let oldInitial = this.getInitial()
    let oldAccepting = this.getAccepting()

    let newAccepting = new NDFARow({}, false, true)
    let newInitial = new NDFARow({}, true, false)

    oldInitial.initial = false
    oldAccepting.accepting = false

    newInitial.addTransition(LAMBDA, oldInitial.sid)
    newInitial.addTransition(LAMBDA, newAccepting.sid)
    oldAccepting.addTransition(LAMBDA, oldInitial.sid)
    oldAccepting.addTransition(LAMBDA, newAccepting.sid)

    return new NDFA(...this.states, newAccepting, newInitial)

  }

  applyConcatenation(ndfa){

    let acceptingLeft = this.getAccepting()
    let initialRight = ndfa.getInitial()

    acceptingLeft.accepting = false
    initialRight.initial = false

    acceptingLeft.addTransition(LAMBDA, initialRight.sid)

    return new NDFA(...this.getAllStates(), ...ndfa.getAllStates())
  }

  applyUnion(ndfa){

    let initialLeft = this.getInitial()
    let initialRight = ndfa.getInitial()
    let acceptingLeft = this.getAccepting()
    let acceptingRight = ndfa.getAccepting()

    let newAccepting = new NDFARow({}, false, true)
    let newInitial = new NDFARow({}, true, false)

    acceptingLeft.accepting = false
    acceptingRight.accepting = false

    initialLeft.initial = false
    initialRight.initial = false

    newInitial.addTransition(LAMBDA, initialRight.sid)
    newInitial.addTransition(LAMBDA, initialLeft.sid)
    acceptingLeft.addTransition(LAMBDA, newAccepting.sid)
    acceptingRight.addTransition(LAMBDA, newAccepting.sid)

    return new NDFA(...this.getAllStates(), ...ndfa.getAllStates(), newAccepting, newInitial)
  }

  feedOne(c) {

  }
}

function makeSignleSymbolNDFA(s){
  let state1 = new NDFARow({}, false, true)
  let transitions = {}
  transitions[s] = [state1.sid]
  let state0 = new NDFARow(transitions, true, false)
  return new NDFA(state0, state1)
}

module.exports = {NDFA, makeSignleSymbolNDFA, LAMBDA}
