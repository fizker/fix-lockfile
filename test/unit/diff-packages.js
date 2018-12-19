// @flow

import { expect } from 'chai'

import diff from '../../src/diff-packages'

import type { Lockfile, Package } from '../../index'

describe('unit/diff-packages.js', () => {
	describe('diffing two equal trees (A -> A)', () => {
		it('should return no differences', () => {
			const actual = diff(generateA(), generateA())
			expect(actual).to.deep.equal([])
		})
	})
	describe('diffing integrity-only changes (A -> B)', () => {
		it('should return the expected differences', () => {
			const expected = [
				{
					path: ['a'],
					integrityOnly: true,
				},
				{
					path: ['c', 'a'],
					integrityOnly: true,
				},
			]
			const actual = diff(generateA(), generateB())
			expect(actual).to.deep.equal(expected)
		})
	})
	describe('diffing version changes (A -> C)', () => {
		it('should return the expected differences', () => {
			const expected = [
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
			const actual = diff(generateA(), generateC())
			expect(actual).to.deep.equal(expected)
		})
	})
	describe('diffing missing keys (A -> D)', () => {
		it('should return the expected differences', () => {
			const expected = [
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
			const actual = diff(generateA(), generateD())
			expect(actual).to.deep.equal(expected)
		})
	})
})

function generateA() : Lockfile {
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
function generateB() : Lockfile {
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
function generateC() : Lockfile {
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
function generateD() : Lockfile {
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
