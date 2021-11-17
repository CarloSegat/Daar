const assert = require('assert')

class DFARunner {

  constructor(dfa) {
    this.dfa = dfa
    this.currentState = dfa.getInitial()
  }

  run(line, index){
    this.currentState = this.dfa.getInitial()
    for (let i = index; i < line.length; i++) {
      if(this.currentState.accepting){
        return true;
      }
      if (this.currentState.charTransitions[line[i]] === undefined) {
        // nod eath state, when we see undefined for a character we consider it as death
        return false
      } else {
        let newStateId = this.currentState.charTransitions[line[i]]
        assert(newStateId.length === 1)
        this.currentState = this.dfa.getStateById(newStateId[0])
      }
    }
    return this.currentState.accepting
  }
}

module.exports = {DFARunner}