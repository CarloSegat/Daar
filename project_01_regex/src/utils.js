const supportedLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
  'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  " ", '.', ",", ';', ':', '-', '_', '[', ']',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const concatenationSymbol = '.';

class IdGenerator {
  static current = 11;

  static get() {
    IdGenerator.current += 1;
    return IdGenerator.current + "";
  }
}

function isUnionOrConcatenationOfClosures(parsedRegex) {
  if(parsedRegex[1] === "(" && parsedRegex[parsedRegex.length - 2] === ")"){
    let closeLeft = indexClosingParenthesis(1, parsedRegex)
    let openRight = indexOpeningParenthesis(parsedRegex.length - 2, parsedRegex)
    return closeLeft !== openRight &&
      parsedRegex[closeLeft - 1] === '*' &&
      parsedRegex[parsedRegex.length - 3] === '*'
  }
}

function isSingleClosure(parsedRegex) {
  return parsedRegex[parsedRegex.length - 2] === "*"
}

function indexOpeningParenthesis(indexOfClose, string){
  let counter = -1;
  for(let inner = indexOfClose - 1; inner >= 0; inner--){
    // console.log(inner)
    if(string[inner] === "("){
      counter++
    }
    if(string[inner] === ")"){
      counter--
    }
    if(counter === 0){
      return inner;
    }
  }
}

function indexClosingParenthesis(indexOfOpen, string){
  let counter = -1;
  for(let inner = indexOfOpen + 1; inner < string.length; inner++){
    // console.log(inner)
    if(string[inner] === "("){
      counter--
    }
    if(string[inner] === ")"){
      counter++
    }
    if(counter === 0){
      return inner;
    }
  }
}

module.exports = {
  supportedLetters,
  IdGenerator,
  isUnionOrConcatenationOfClosures,
  isSingleClosure,
  concatenationSymbol,
  indexOfClose: indexClosingParenthesis,
  indexOfOpen: indexOpeningParenthesis
}