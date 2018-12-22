#!/usr/bin/env node

var run
try {
	require('@babel/register')
	run = require('./src/run').default
} catch(e) {
	run = require('./dist/run').default
}

var file = process.argv[2]

run(file)
.catch(console.error)
