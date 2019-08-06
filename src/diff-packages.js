// @flow strict

import type { Lockfile, Package, Diff } from './types'

export default function(a:Lockfile, b:Lockfile) : $ReadOnlyArray<Diff> {
	return getDepDiff([], a.dependencies, b.dependencies)
		.filter(x => x.isURLUsingHTTPForNPMRegistry || x.hasIntegrityChanged || x.hasOtherChanges)
}

function isURLUsingHTTPForNPM(url:?string) {
	if(url == null) {
		return false
	}
	return url.startsWith('http://registry.npmjs.org')
}

function getDepDiff(path:$ReadOnlyArray<string>, a:{ [string]:Package }, b:{ [string]:Package }) : $ReadOnlyArray<Diff> {
	const aKeys = Object.keys(a)
	const bKeys = new Set(Object.keys(b))

	const diffs = []
	for(const key of aKeys) {
		const keyPath = path.concat(key)
		if(!bKeys.has(key)) {
			diffs.push({
				path: keyPath,
				isURLUsingHTTPForNPMRegistry: isURLUsingHTTPForNPM(a[key].resolved),
				hasIntegrityChanged: true,
				hasOtherChanges: true,
			})
			continue
		}

		bKeys.delete(key)

		const aVersion = a[key]
		const bVersion = b[key]

		const hasIntegrityChanged = aVersion.integrity !== bVersion.integrity
		const isURLUsingHTTPForNPMRegistry = isURLUsingHTTPForNPM(bVersion.resolved)
		const hasOtherChanges =	aVersion.version !== bVersion.version
			|| aVersion.dev !== bVersion.dev
			|| aVersion.optional !== bVersion.optional
			|| hasReqDiff(aVersion.requires || {}, bVersion.requires || {})

		diffs.push({
			path: keyPath,
			hasIntegrityChanged,
			isURLUsingHTTPForNPMRegistry,
			hasOtherChanges,
		})

		const depDiff = getDepDiff(keyPath, aVersion.dependencies || {}, bVersion.dependencies || {})
		diffs.push(...depDiff)
	}
	for(const key of bKeys) {
		diffs.push({
			path: path.concat(key),
			isURLUsingHTTPForNPMRegistry: isURLUsingHTTPForNPM(b[key].resolved),
			hasIntegrityChanged: true,
			hasOtherChanges: true,
		})
	}
	return diffs
}
function hasReqDiff(a:{[string]:string}, b:{[string]:string}) : boolean {
	const aKeys = Object.keys(a)
	const bKeys = new Set(Object.keys(b))

	if(aKeys.length !== bKeys.size) {
		return true
	}

	return !aKeys.every(x => bKeys.has(x))
}

export function sortDiff(diff:$ReadOnlyArray<Diff>) : $ReadOnlyArray<Diff> {
	return diff.slice().sort((a, b) => {
		for(let index = 0; index < a.path.length; index++) {
			if(b.path[index] == null) {
				break
			}

			if(a.path[index] === b.path[index]) {
				continue
			}

			return a.path[index] < b.path[index]
				? -1
				: 1
		}

		return a.path.length - b.path.length
	})
}
