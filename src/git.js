// @flow strict

import path from 'path'
import { promises as fs } from 'fs'
import exec from './exec'

export async function catFile(filePath:string) : Promise<string> {
	const cwd = path.dirname(filePath)
	const file = path.basename(filePath)
	const stats = await fs.stat(filePath)
	const { stdout, stderr } = await exec(`git cat-file -p HEAD:"${file}"`, {
		cwd,
		maxBuffer: stats.size * 2,
	})

	return stdout
}
