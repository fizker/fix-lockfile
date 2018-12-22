#!/usr/bin/env node

var run
try {
	require('@babel/register')
	run = require('./src/run').default
} catch(e) {
	run = require('./dist/run').default
}

module.exports = run
