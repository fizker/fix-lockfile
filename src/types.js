// @flow strict

export type Package = $ReadOnly<{|
	version: string,
	integrity: string,
	resolved: string,
	dev?: boolean,
	optional?: boolean,
	requires?: { [string]: string },
	dependencies?: { [string]: Package },
|}>

export type Lockfile = $ReadOnly<{
	name: string,
	version: string,
	lockfileVersion: number,
	requires: boolean,
	dependencies: { [string]: Package },
}>

export type Diff = $ReadOnly<{
	path: $ReadOnlyArray<string>,
	integrityOnly: boolean,
}>
