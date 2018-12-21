// @flow

import { expect } from 'chai'

import diff from '../../src/diff-packages'

import type { Lockfile, Package } from '../../src/types'

import {
	generateA, generateA1, generateA2, generateA3,
	getDiffForA_A1, getDiffForA_A2, getDiffForA_A3,
} from './_data'

describe('unit/diff-packages.js', () => {
	describe('diffing two equal trees (A -> A)', () => {
		it('should return no differences', () => {
			const actual = diff(generateA(), generateA())
			expect(actual).to.deep.equal([])
		})
	})
	describe('diffing integrity-only changes (A -> A1)', () => {
		it('should return the expected differences', () => {
			const expected = getDiffForA_A1()
			const actual = diff(generateA(), generateA1())
			expect(actual).to.deep.equal(expected)
		})
	})
	describe('diffing version changes (A -> A2)', () => {
		it('should return the expected differences', () => {
			const expected = getDiffForA_A2()
			const actual = diff(generateA(), generateA2())
			expect(actual).to.deep.equal(expected)
		})
	})
	describe('diffing missing keys (A -> A3)', () => {
		it('should return the expected differences', () => {
			const expected = getDiffForA_A3()
			const actual = diff(generateA(), generateA3())
			expect(actual).to.deep.equal(expected)
		})
	})
})
