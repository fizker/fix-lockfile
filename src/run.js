// @flow strict

import { promises as fs } from 'fs'
import readFiles from './read-files'
import restoreLockfile from './restore-lockfile'
import diffPackages from './diff-packages'

export default async function(filePath:string) : Promise<void> {
	const { current, original } = await readFiles(filePath)
	const diffs = diffPackages(original, current)
	const updated = restoreLockfile({ current, original, diffs })

	const json = JSON.stringify(updated, null, 2)
	await fs.writeFile(filePath, json + '\n')
}
