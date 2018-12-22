// @flow

import { expect } from 'chai'

import restore from '../../src/restore-lockfile'

import {
	generateA, generateA1, generateA2, generateA3,
	getDiffForA_A1, getDiffForA_A2, getDiffForA_A3
} from './_data'

describe('unit/restore-lockfile.js', () => {
	describe('restoring a file with no changes', () => {
		it('should not be changed', () => {
			const current = generateA()
			const original = generateA()
			const diffs = []
			const restored = restore({ current, original, diffs })
			expect(restored).to.deep.equal(current)
		})
	})

	describe('restoring a file with integrity-only changes', () => {
		it('should be fully restored', () => {
			const current = generateA1()
			const original = generateA()
			const diffs = getDiffForA_A1()
			const restored = restore({ current, original, diffs })
			expect(restored).to.deep.equal(original)
		})
	})

	describe('restoring a file with no integrity-only changes', () => {
		it('should not be restored', () => {
			const current = generateA3()
			const original = generateA()
			const diffs = getDiffForA_A3()
			const restored = restore({ current, original, diffs })
			expect(restored).to.deep.equal(current)
		})
	})

	describe('restoring a file with mixed changes', () => {
		it('should restore the integrity-only changes', () => {
			const current = generateA2()
			const original = generateA()
			const diffs = getDiffForA_A2()
			const mixOfOrgAndCurrent = {
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
								integrity: "a2",
								resolved: "http://a/2",
							},
						},
					},
				},
			}
			const restored = restore({ current, original, diffs })
			expect(restored).to.deep.equal(mixOfOrgAndCurrent)
		})
	})
})
