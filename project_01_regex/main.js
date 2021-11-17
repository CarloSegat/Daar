const process = require( 'process' );
const fs = require('fs')
const { runRegex } = require('./src/runRegex')

let regex = process.argv[process.argv.length - 2]
let fileName = process.argv[process.argv.length - 1]

try {
  const data = fs.readFileSync(fileName, 'utf8')
  runRegex(regex, data).forEach(match => console.log(match))
} catch (err) {
  console.error(err)
}