const { IdGenerator } = require('./utils')
const { makeId } = require('./utils')


class NDFARow {
  constructor(transitions, initial, accepting, id=undefined) {
    this.sid = id || IdGenerator.get()
    this.charTransitions = transitions // {a: [0, 1], ...}
    this.initial = initial
    this.accepting = accepting
  }
  addTransition(symbol, state){
    this.charTransitions[symbol] = [...(this.charTransitions[symbol] || []), state]
  }

  getAllTransitions(){
    return this.charTransitions;
  }

  getReachableStates(char){
    return this.charTransitions[char] || []
  }
}

module.exports = NDFARow;