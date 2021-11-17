# EGREP Clone - DAAR 01

## Requirements
This program requires NodeJS.
Please install it on your system as described here: https://nodejs.org/en/download/package-manager/

## Set up
In the root folder, run `chmod +x ./myegrep.sh` in order to be able to run the script.

## Run myegrep
In the root folder run `node main.js <regex> <file_path.txt>`.
For example `node main.js Sargon .data/testText.txt`.

## Run unit tests
The `./test` folder contains some basic unit tests that are useful in development to spot 
mistakes in the pipeline.
In the root folder, run `node ./runUnitTests.js` to run the tests.
If you don't see any assert exception being
printed that means that everything passed.

## Run edd-to-end tests
Run `node ./runE2ETEsts.js` in the root folder.
We treat the system as a blackbox and compare its result with
the linux egrep tool.
