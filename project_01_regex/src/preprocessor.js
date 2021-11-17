const { supportedLetters } = require('./utils')

function preprocess(string){
  return string.replace(/\./g, "(" + supportedLetters.join('|') + ")")
}

module.exports = {preprocess}