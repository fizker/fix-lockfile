// @flow strict

import { promisify } from 'util'
import { exec } from 'child_process'

type Options = {
	cwd?: string,
}

export default (promisify(exec):(string, Options) => Promise<{ stdout: string, stderr: string }>)
