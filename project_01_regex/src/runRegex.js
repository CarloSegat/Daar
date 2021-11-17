const build_NDFA = require('./buildNDFA')
const { doSubsetConstruction } = require('./subsetConstruction')
const { removeLambda } = require('./removeLambda')
const { LAMBDA } = require('./ndfa')
const { parseRawRegex } = require('./syntaxTree')
const { preprocess } = require('./preprocessor')
const { DFARunner } = require('./DFARunner')
const { isUnionOrConcatenationOfClosures } = require('./utils')
const { isSingleClosure } = require('./utils')

const { concatenationSymbol } = require('./utils')

function runRegex(regex, text) {
  let preprocess1 = preprocess(regex)
  let parsedRegex = parseRawRegex(preprocess1)

  if(isSingleClosure(parsedRegex) || isUnionOrConcatenationOfClosures(parsedRegex)){
    return text.split('\n');
  }

  let ndfaWithLambda = build_NDFA(parsedRegex)
  let ndfaWithoutLambda = removeLambda(ndfaWithLambda, LAMBDA)
  let dfa = doSubsetConstruction(ndfaWithoutLambda)
  let runner = new DFARunner(dfa)
  let lines = text.split('\n').map(s => s.trim())

  let result = []
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      if (runner.run(line, i)) {
        result.push(line);
        break;
      }
    }
  }
  return result
}



module.exports = {runRegex}
