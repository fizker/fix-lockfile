// @flow strict

import { promises as fs } from 'fs'
import { catFile } from './git'
import diffPackages from './diff-packages'

import type { Diff, Lockfile } from './types'

export default async function(filePath:string) : Promise<$ReadOnlyArray<Diff>> {
	const originalRawFile = await catFile(filePath)
	const currentRawFile = await fs.readFile(filePath, { encoding: 'utf8' })

	const parsedOriginal:Lockfile = JSON.parse(originalRawFile)
	const parsedCurrent:Lockfile = JSON.parse(currentRawFile.toString())

	return diffPackages(parsedOriginal, parsedCurrent)
}
