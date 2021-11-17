//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'test');
const thisFileName = __filename;
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  files.forEach(function (file) {
    let fork = require('child_process').fork(path.join(directoryPath, file), {timeout: 2000})
    fork.on('exit', (sig) => {
      console.log('done: ' + file)
      fork.kill('SIGKILL')
    })
  });
});

