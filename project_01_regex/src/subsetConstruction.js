const NDFARow = require('./ndfaRow')
const { NDFA } = require('./ndfa')

function doSubsetConstruction(ndfa){
  let statesToAdd = []
  let record = {}
  let states = [ndfa.getInitial()]

  function doDeterministicTransition(transitions, symbol) {
    let stateReached = record[transitions[symbol][0]] || ndfa.getStateById(transitions[symbol][0])
    if (record[stateReached.sid] === undefined) {
      statesToAdd.push(stateReached)
      record[stateReached.sid] = stateReached
    }
  }

  function doNonDeterministicTransition(transitions, symbol, state) {
    let conglomerateState = buildConglomerateState(transitions, symbol)
    if (record[conglomerateState.sid] !== undefined) {
      state.charTransitions[symbol] = []
      state.addTransition(symbol, conglomerateState.sid)
    } else {
      state.charTransitions[symbol] = []
      state.addTransition(symbol, conglomerateState.sid)
      statesToAdd.push(conglomerateState)
      record[conglomerateState.sid] = conglomerateState
      record[conglomerateState.sid] = conglomerateState
    }
  }

  function buildConglomerateState(transitions, symbol) {
    let conglomerateState = new NDFARow({}, false, false)
    let conglomerateId = ''
    for (const stateId of transitions[symbol]) {
      conglomerateId = conglomerateId + stateId
      let oneOfManyStates = record[stateId] || ndfa.getStateById(stateId)
      conglomerateState.accepting = oneOfManyStates.accepting || conglomerateState.accepting
      conglomerateState.initial = oneOfManyStates.initial || conglomerateState.initial
      let allTransitions = oneOfManyStates.getAllTransitions()
      for (const symb2 in allTransitions) {
        allTransitions[symb2].forEach(state2 => conglomerateState.addTransition(symb2, state2))
      }
    }
    conglomerateState.sid = conglomerateId
    return conglomerateState
  }

  while(true) {
    statesToAdd = []
    for (const state of states) {
      let transitions = state.getAllTransitions()
      for (const symbol in transitions) {
        if(transitions[symbol].length === 1){
          doDeterministicTransition(transitions, symbol)
        } else {
          doNonDeterministicTransition(transitions, symbol, state)
        }
      }
    }
    if(statesToAdd.length === 0){
      break;
    }
    states = [...states, ...statesToAdd]
  }
  return new NDFA(...states)
}

module.exports = {doSubsetConstruction}