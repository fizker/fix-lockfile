// @flow strict

import path from 'path'
import exec from './exec'

export async function catFile(filePath:string) : Promise<string> {
	const cwd = path.dirname(filePath)
	const file = path.basename(filePath)
	const { stdout, stderr } = await exec(`git cat-file -p HEAD:"${file}"`, { cwd })

	return stdout
}
