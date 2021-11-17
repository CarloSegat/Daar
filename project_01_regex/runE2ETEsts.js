const { execSync } = require('child_process');

function assertSameOutput(regex, file) {
  let stdout = execSync('egrep ' + "'" + regex + "' " + file + ' || echo ""').toString()
  let egrepOriginalResult = stdout
    .split('\n')
    .filter(s => s.length !== 0)
    .map(s => s.trim())

  let myResult = execSync('node ./main.js ' + "'" + regex + "' " + file).toString()
  myResult = myResult
    .split('\n')
    .filter(s => s.length !== 0)
    .map(s => s.trim())

  console.assert(egrepOriginalResult.length === myResult.length)
  for (const match in egrepOriginalResult) {
    console.assert(egrepOriginalResult[match] === myResult[match], `Assertion failed: regex ${regex} for file ${file} failed on ${egrepOriginalResult[match]} `)
  }
}

let files = ["./data/testText.txt", "./data/testText2.txt"]
let regexes = [ "Sargon", "random_string_wont_be_present_54gbh",
  "Nabop.las*ar|Sargon|t(he)* best", "Nabop.las*ar",
  "Nabop.las*ar|Sargon", "himself", '(W|w)']

for (const file of files) {
  for (const regex of regexes) {
    assertSameOutput(regex, file)
  }
}
console.log("End to end tests finished. Check logs for errors.")
