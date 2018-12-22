let run
try {
	require('@babel/register')
	run = require('./src/run').default
} catch(e) {
	run = require('./dist/run').default
}

const [ , , file ] = process.argv

run(file)
.catch(console.error)
