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
				resolved: "https://registry.npmjs.org/a/-/1",
			},
			"b": {
				version: "1",
				integrity: "b",
				resolved: "https://registry.npmjs.org/b/-/1",
				requires: {
					"a": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "https://registry.npmjs.org/c/-/b",
				requires: {
					"a": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2",
						resolved: "https://registry.npmjs.org/a/-/2",
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
				resolved: "https://registry.npmjs.org/a/-/1",
			},
			"b": {
				version: "1",
				integrity: "b",
				resolved: "https://registry.npmjs.org/b/-/1",
				requires: {
					"a": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "https://registry.npmjs.org/c/-/b",
				requires: {
					"a": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2a",
						resolved: "https://registry.npmjs.org/a/-/2",
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
				resolved: "https://registry.npmjs.org/a/-/1",
			},
			"b": {
				version: "2",
				integrity: "b2",
				resolved: "https://registry.npmjs.org/b/-/2",
				requires: {
					"a": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "https://registry.npmjs.org/c/-/b",
				requires: {
					"a": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2a",
						resolved: "https://registry.npmjs.org/a/-/2",
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
				resolved: "https://registry.npmjs.org/a/-/1",
				requires: {
					"c": "1",
				},
			},
			"c": {
				version: "1",
				integrity: "c",
				resolved: "https://registry.npmjs.org/c/-/b",
				requires: {
					"a": "2",
					"d": "2",
				},
				dependencies: {
					"a": {
						version: "2",
						integrity: "a2",
						resolved: "https://registry.npmjs.org/a/-/2",
					},
					"d": {
						version: "2",
						integrity: "d2",
						resolved: "https://registry.npmjs.org/d/-/2",
					},
				},
			},
			"d": {
				version: "1",
				integrity: "d",
				resolved: "https://registry.npmjs.org/d/-/1"
			},
		},
	}
}

export function getDiffForA_A1() {
	return [
		{
			path: ['a'],
			hasIntegrityChanged: true,
			hasOtherChanges: false,
		},
		{
			path: ['c', 'a'],
			hasIntegrityChanged: true,
			hasOtherChanges: false,
		},
	]
}

export function getDiffForA_A2() {
	return [
		{
			path: ['a'],
			hasIntegrityChanged: true,
			hasOtherChanges: false,
		},
		{
			path: ['b'],
			hasIntegrityChanged: true,
			hasOtherChanges: true,
		},
		{
			path: ['c', 'a'],
			hasIntegrityChanged: true,
			hasOtherChanges: false,
		},
	]
}

export function getDiffForA_A3() {
	return [
		{
			path: ['a'],
			hasIntegrityChanged: false,
			hasOtherChanges: true,
		},
		{
			path: ['b'],
			hasIntegrityChanged: true,
			hasOtherChanges: true,
		},
		{
			path: ['c'],
			hasIntegrityChanged: false,
			hasOtherChanges: true,
		},
		{
			path: ['c', 'd'],
			hasIntegrityChanged: true,
			hasOtherChanges: true,
		},
		{
			path: ['d'],
			hasIntegrityChanged: true,
			hasOtherChanges: true,
		},
	]
}

export function getDiffForA_A4() {
	return [
		{
			path: ['c'],
			hasIntegrityChanged: false,
			hasOtherChanges: false,
		},
	]
}
