#!/usr/bin/env node

var run
try {
	require('@babel/register')
	run = require('./src/run').default
} catch(e) {
	run = require('./dist/run').default
}

var file = process.argv[2]

if(!file) {
	console.error(
`Usage: fix-lockfile <lockfile>

where <lockfile> is the npm-shrinkwrap.json or package-lock.json to fix.
`)
	process.exit(1)
}

run(file)
.catch(console.error)
