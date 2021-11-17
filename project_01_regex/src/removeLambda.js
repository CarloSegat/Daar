const { LAMBDA } = require('./ndfa')
const assert = require('assert')
const NDFARow = require('./ndfaRow')
const { IdGenerator } = require('./utils')
const { NDFA } = require('./ndfa')



function groupStates(ndfaWithLambda) {

  let allStates = ndfaWithLambda.getAllStates()

  function DepthFirstLambdaReachability(stateObj, char, ndfa) {

    let reachableStates = stateObj.getReachableStates(char)
    let temp = reachableStates.map(s => ndfa.getStateById(s))

    let result = [stateObj]

    for (const s of temp) {
      let temp2 = DepthFirstLambdaReachability(s, char, ndfa)
      result = [...result, ...temp2]
    }

    return result
  }

  let merged = []
  for (const s of allStates) {
    merged.push(DepthFirstLambdaReachability(s, LAMBDA, ndfaWithLambda))
  }
  merged = merged.filter(m => m.length > 0)


  function keepMaximalGroups() {

    let present = {}
    let keptStates = []

    for (const s of allStates) {
      if (present[s.sid]) {
        continue
      }
      let including = merged.filter(group => group.includes(s))

      let indexLongest = including.reduce((acc, arr, idx) => {
        // console.log(acc, idx, JSON.stringify([arr, including[acc]]))
        return arr.length > including[acc].length ? idx : acc
      }, 0)

      keptStates.push(including[indexLongest])
      including[indexLongest].forEach(i => present[i.sid] = true)
    }
    return keptStates
  }

  return keepMaximalGroups()

}


function stateToGroupIndex(keptStates) {
  let index = {}
  for (let i = 0; i < keptStates.length; i++) {
    for (const single of keptStates[i]) {
      index[single.sid] = [...index[single.sid] || [], i]
    }
  }
  return index
}

function buildNewNDFA(keptStates, index) {
// reduce
  let newNDFARows = []

  let precomputedIDs = keptStates.map(s => IdGenerator.get())

  for (let i = 0; i < keptStates.length; i++) {
    let ndfaRow = new NDFARow({}, false, false, precomputedIDs[i])
    newNDFARows.push(ndfaRow)
    for (const s of keptStates[i]) {
      if (s.initial) {
        ndfaRow.initial = true
      }
      if (s.accepting) {
        ndfaRow.accepting = true
      }

      delete s.charTransitions[LAMBDA]

      for (const trans in s.charTransitions) {
        assert(s.charTransitions[trans].length === 1)
        ndfaRow.addTransition(trans, precomputedIDs[index[s.charTransitions[trans][0]]])
      }

    }
  }
  return new NDFA(...newNDFARows)
}

function removeLambda(ndfa){
  let keptStates = groupStates(ndfa)
  let index = stateToGroupIndex(keptStates)
  let newNDFA = buildNewNDFA(keptStates, index)
  return newNDFA
}


module.exports = {removeLambda}