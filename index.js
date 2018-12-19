// @flow

type Package = {|
	version: string,
	integrity: string,
	resolved: string,
	dev?: boolean,
	optional?: boolean,
	requires?: { [string]: string },
	dependencies?: { [string]: Package },
|}

type Lockfile = {
	name: string,
	version: string,
	lockfileVersion: number,
	requires: boolean,
	dependencies: { [string]: Package },
}
