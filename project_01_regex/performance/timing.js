const process = require( 'process' );
const { execSync } = require('child_process');

function timeEgrepAndMyprogram(regex, file) {

  let start = process.hrtime()
  execSync('egrep ' + "'" + regex + "' " + file + ' || echo ""')
  let endEgrep = process.hrtime(start)
  endEgrep = ((endEgrep[0] * 1000000) + endEgrep[1]) / 1000000


  start = process.hrtime()
  execSync('node ../main.js ' + "'" + regex + "' " + file)
  let endMy = process.hrtime(start)
  endMy = ((endMy[0] * 1000000) + endMy[1]) / 1000000

  return [endEgrep, endMy]
}

let files = ["../data/testText.txt", "../data/testText2.txt"]
let regexes =["Sargon", "random_string_wont_be_present_54gbh",
  "Nabop.las*ar|Sargon|t(he)* best", "Nabop.las*ar",
  "Nabop.las*ar|Sargon", "himself", '(W|w)', "of the gate was in progress,\n and there are traces of two temporary"]

let egrepTimes = []
let myTimes = []

for (const file of files) {
  for (const regex of regexes) {
    let data = timeEgrepAndMyprogram(regex, file)
    egrepTimes.push(data[0])
    myTimes.push(data[1])
  }
}

console.log(egrepTimes)
console.log(myTimes)
