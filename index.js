// @flow
require('@babel/register')

const [ , , file ] = process.argv

const run = require('./src/run').default
run(file)
.then(() => console.log('done'))
.catch(console.error)
