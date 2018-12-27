// @flow strict

import { promises as fs } from 'fs'
import readFiles from './read-files'
import restoreLockfile from './restore-lockfile'
import diffPackages from './diff-packages'

export default async function(filePath:string) : Promise<void> {
	const { current, original, lineEnding } = await readFiles(filePath)
	const diffs = diffPackages(original, current)
	const updated = restoreLockfile({ current, original, diffs })

	const json = JSON.stringify(updated, null, 2) + '\n'

	const normalizedLineEndings = json.replace(/\n/g, lineEnding)

	await fs.writeFile(filePath, normalizedLineEndings)
}
