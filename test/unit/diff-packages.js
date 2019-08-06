// @flow

import { expect } from 'chai'

import diff, { sortDiff } from '../../src/diff-packages'

import type { Lockfile, Diff, Package } from '../../src/types'

import {
	generateA, generateA1, generateA2, generateA3, generateA4,
	getDiffForA_A1, getDiffForA_A2, getDiffForA_A3, getDiffForA_A4,
} from './_data'

function runTest(name:string, {expected, expectedReversed = expected, original = generateA(), update }: { expected: $ReadOnlyArray<Diff>, expectedReversed?: $ReadOnlyArray<Diff>, original?: Lockfile, update: Lockfile }) {
	describe(name, () => {
		it('should return the expected differences', () => {
			const actual = diff(original, update)
			expect(sortDiff(actual)).to.deep.equal(sortDiff(expected))
		})
		it('should return the same diff if the arguments are reversed', () => {
			const actual = diff(update, original)
			expect(sortDiff(actual)).to.deep.equal(sortDiff(expectedReversed))
		})
	})
}

describe('unit/diff-packages.js', () => {
	runTest('diffing two equal trees (A -> A)', { expected: [], update: generateA() })
	runTest('diffing integrity-only changes (A -> A1)', { expected: getDiffForA_A1(), update: generateA1() })
	runTest('diffing version changes (A -> A2)', { expected: getDiffForA_A2(), update: generateA2() })
	runTest('diffing missing keys (A -> A3)', { expected: getDiffForA_A3(), update: generateA3() })
	runTest('diffing http: URL (A -> A4)', { expected: getDiffForA_A4(), expectedReversed: getDiffForA_A4(false), update: generateA4() })
})
