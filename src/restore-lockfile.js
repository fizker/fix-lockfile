// @flow strict

import type { Lockfile, Diff, Package } from './types'

type Params = {
	current: Lockfile,
	original: Lockfile,
	diffs: $ReadOnlyArray<Diff>,
}

export default function({ current, original, diffs }: Params) : Lockfile {
	let output = current
	for(let diff of diffs) {
		const [ first, ...rest ] = diff.path
		let updatedPackage = output.dependencies[first]
		if(diff.isURLUsingHTTPForNPMRegistry) {
			updatedPackage = updateRegistryURL(updatedPackage, rest)
			output = {
				...output,
				dependencies: {
					...output.dependencies,
					[first]: updatedPackage,
				},
			}
		}

		if(diff.hasOtherChanges) {
			continue
		}

		const originalPackage = getPackage(diff.path, original.dependencies)
		if(originalPackage == null) {
			continue
		}

		if(diff.hasIntegrityChanged) {
			updatedPackage = updateIntegrity(originalPackage.integrity, updatedPackage, rest)
		}
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

function updateRegistryURL(pack:Package, packagePath:$ReadOnlyArray<string>) : Package {
	if(packagePath.length > 0) {
		if(pack.dependencies == null) {
			return pack
		}

		const [ first, ...rest ] = packagePath
		return {
			...pack,
			dependencies: {
				...pack.dependencies,
				[first]: updateRegistryURL(pack.dependencies[first], rest),
			},
		}
	}

	if(pack.resolved == null || typeof pack.resolved !== 'string') {
		return pack
	}

	return {
		...pack,
		resolved: pack.resolved.replace(/^http:/, 'https:'),
	}
}
