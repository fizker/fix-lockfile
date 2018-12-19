// @flow

import type { Lockfile, Package } from '../index'

export type Diff = {
	path: $ReadOnlyArray<string>,
	integrityOnly: boolean,
}

export default function(a:Lockfile, b:Lockfile) : $ReadOnlyArray<Diff> {
	return getDepDiff([], a.dependencies, b.dependencies)
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
				integrityOnly: false,
			})
			continue
		}

		bKeys.delete(key)

		const aVersion = a[key]
		const bVersion = b[key]

		if(
			aVersion.version !== bVersion.version
			|| aVersion.resolved !== bVersion.resolved
			|| aVersion.dev !== bVersion.dev
			|| aVersion.optional !== bVersion.optional
		) {
			diffs.push({
				path: keyPath,
				integrityOnly: false,
			})
		} else if(aVersion.integrity !== bVersion.integrity) {
			diffs.push({
				path: keyPath,
				integrityOnly: true,
			})
		}

		const depDiff = getDepDiff(keyPath, aVersion.dependencies || {}, bVersion.dependencies || {})
		const requireDiff = getReqDiff(keyPath, aVersion.requires || {}, bVersion.requires || {})
			.filter(x => depDiff.find(y => x.path.every(xx => y.path.includes(xx))) == null)
		const combined = requireDiff.concat(depDiff)
		diffs.push(...combined)
	}
	for(const key of bKeys) {
		diffs.push({
			path: path.concat(key),
			integrityOnly: false,
		})
	}
	return diffs
}
function getReqDiff(path:$ReadOnlyArray<string>, a:{[string]:string}, b:{[string]:string}) : $ReadOnlyArray<Diff> {
	const aKeys = Object.keys(a)
	const bKeys = new Set(Object.keys(b))

	const diffs = []

	for(const key of aKeys) {
		const keyPath = path.concat(key)
		if(!bKeys.has(key)) {
			diffs.push({
				path: keyPath,
				integrityOnly: false,
			})
			continue
		}

		bKeys.delete(key)

		if(a[key] !== b[key]) {
			diffs.push({
				path: keyPath,
				integrityOnly: false,
			})
		}
	}
	for(const key of bKeys) {
		diffs.push({
			path: path.concat(key),
			integrityOnly: false,
		})
	}
	return diffs
}
