// @flow

import type { Lockfile } from '../../src/types'

export function generateA() : Lockfile {
	return {
		name: 'A',
		version: '1.0.0',
		lockfileVersion: 1,
		requires: true,
		dependencies: {
			"a": {
				version: "1",
				integrity: "a",
				resolved: "http://a/1",
			},
			"b": {
				version: "1",
				integrity: "b",
				resolved: "http://b/1",
				requires: {
					"a": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "http://b",
				requires: {
					"a": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2",
						resolved: "http://a/2",
					},
				},
			},
		},
	}
}

// This is A with integrity changes only
export function generateA1() : Lockfile {
	return {
		name: 'A',
		version: '1.0.0',
		lockfileVersion: 1,
		requires: true,
		dependencies: {
			"a": {
				version: "1",
				integrity: "aa",
				resolved: "http://a/1",
			},
			"b": {
				version: "1",
				integrity: "b",
				resolved: "http://b/1",
				requires: {
					"a": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "http://b",
				requires: {
					"a": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2a",
						resolved: "http://a/2",
					},
				},
			},
		},
	}
}

// This is A with updated dependencies
export function generateA2() : Lockfile {
	return {
		name: 'A',
		version: '1.0.0',
		lockfileVersion: 1,
		requires: true,
		dependencies: {
			"a": {
				version: "1",
				integrity: "aa",
				resolved: "http://a/1",
			},
			"b": {
				version: "2",
				integrity: "b2",
				resolved: "http://b/2",
				requires: {
					"a": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "http://b",
				requires: {
					"a": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2a",
						resolved: "http://a/2",
					},
				},
			},
		},
	}
}

// This is A with keys missing
export function generateA3() : Lockfile {
	return {
		name: 'A',
		version: '1.0.0',
		lockfileVersion: 1,
		requires: true,
		dependencies: {
			"a": {
				version: "1",
				integrity: "a",
				resolved: "http://a/1",
				requires: {
					"c": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "http://b",
				requires: {
					"a": "2",
					"d": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2",
						resolved: "http://a/2",
					},
					"d": {
						version: "2",
						integrity: "d2",
						resolved: "http://d/2",
					},
				},
			},
			"d": {
				version: "1",
				integrity: "d",
				resolved: "http://d/1"
			},
		},
	}
}

export function getDiffForA_A1() {
	return [
		{
			path: ['a'],
			integrityOnly: true,
		},
		{
			path: ['c', 'a'],
			integrityOnly: true,
		},
	]
}

export function getDiffForA_A2() {
	return [
		{
			path: ['a'],
			integrityOnly: true,
		},
		{
			path: ['b'],
			integrityOnly: false,
		},
		{
			path: ['c', 'a'],
			integrityOnly: true,
		},
	]
}

export function getDiffForA_A3() {
	return [
		{
			path: ['a', 'c'],
			integrityOnly: false,
		},
		{
			path: ['b'],
			integrityOnly: false,
		},
		{
			path: ['c', 'd'],
			integrityOnly: false,
		},
		{
			path: ['d'],
			integrityOnly: false,
		},
	]
}
