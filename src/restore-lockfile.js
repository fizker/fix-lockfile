// @flow strict

import type { Lockfile, Diff, Package } from './types'

type Params = {
	current: Lockfile,
	original: Lockfile,
	diffs: $ReadOnlyArray<Diff>,
}

export default function({ current, original, diffs }: Params) : Lockfile {
	let output = current
	for(const diff of diffs) {
		if(!diff.integrityOnly) {
			continue
		}

		const originalPackage = getPackage(diff.path, original.dependencies)
		if(originalPackage == null) {
			continue
		}

		const [ first, ...rest ] = diff.path
		const p = output.dependencies[first]
		const updatedPackage = updateIntegrity(originalPackage.integrity, p, rest)
		output = {
			...output,
			dependencies: {
				...output.dependencies,
				[first]: updatedPackage,
			},
		}
	}
	return output
}

function getPackage(keys:$ReadOnlyArray<string>, packages:{[string]: Package}) : ?Package {
	if(keys.length === 0) {
		return null
	}

	const [ first, ...rest ] = keys
	const p = packages[first]
	if(p == null || rest.length === 0) {
		return p
	}
	return getPackage(rest, p.dependencies || {})
}

function updateIntegrity(integrity:string, p:Package, packagePath:$ReadOnlyArray<string>) : Package {
	if(packagePath.length === 0) {
		return {
			...p,
			integrity,
		}
	}

	if(p.dependencies == null) {
		return p
	}

	const [ first, ...rest ] = packagePath
	return {
		...p,
		dependencies: {
			...p.dependencies,
			[first]: updateIntegrity(integrity, p.dependencies[first], rest),
		},
	}
}
