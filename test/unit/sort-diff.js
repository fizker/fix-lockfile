// @flow

import { expect } from "chai"

import { sortDiff } from "../../src/diff-packages"
import type { Diff } from '../../src/types'

function createDiff(path) : Diff {
	return {
		path,
		hasIntegrityChanged: false,
		isURLUsingHTTPForNPMRegistry: true,
		hasOtherChanges: false,
	}
}

describe("unit/sort-diff", () => {
	const tests:{ name: string, input: $ReadOnlyArray<Diff>, expected: $ReadOnlyArray<Diff> }[] = [ {
		name: "already sorted",
		input: [ ["a"], ["b"], ["c"] ]
			.map(createDiff),
		expected: [ ["a"], ["b"], ["c"] ]
			.map(createDiff),
	}, {
		name: "single-layer path",
		input: [ ["b"], ["a"], ["c"] ]
			.map(createDiff),
		expected: [ ["a"], ["b"], ["c"] ]
			.map(createDiff),
	}, {
		name: "two-layer path",
		input: [ ["a", "b"], ["b"], ["a"], ["c"] ]
			.map(createDiff),
		expected: [ ["a"], ["a", "b"], ["b"], ["c"] ]
			.map(createDiff),
	} ]

	for(const { name, input, expected } of tests) {
		describe(name, () => {
			it("should sort correctly", () => {
				const actual = sortDiff(input)
				expect(actual).to.deep.equal(expected)
			})
		})
	}
})
