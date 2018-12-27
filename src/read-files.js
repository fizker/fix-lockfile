// @flow strict

import { promises as fs } from 'fs'
import { catFile } from './git'

import type { Lockfile } from './types'

export default async function(filePath:string) : Promise<{ current: Lockfile, original: Lockfile, lineEnding: '\r'|'\n'|'\r\n' }> {
	const originalRawFile = await catFile(filePath)
	const currentRawFile = await fs.readFile(filePath, { encoding: 'utf8' })

	const parsedOriginal:Lockfile = JSON.parse(originalRawFile)
	const parsedCurrent:Lockfile = JSON.parse(currentRawFile.toString())

	return {
		current: parsedCurrent,
		original: parsedOriginal,
		lineEnding: currentRawFile.includes('\r\n') ? '\r\n' : currentRawFile.includes('\r') ? '\r' : '\n',
	}
}
