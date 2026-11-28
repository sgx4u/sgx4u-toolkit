import { describe, expect, it } from "vitest";
import { getPermutations } from "./get-permutations.js";

describe("getPermutations", () => {
    it("returns the six permutations of three items", () => {
        const values = Object.freeze([1, 2, 3]);
        const permutations = getPermutations({ array: values });
        expect(permutations).toEqual([
            [1, 2, 3],
            [1, 3, 2],
            [2, 1, 3],
            [2, 3, 1],
            [3, 1, 2],
            [3, 2, 1],
        ]);
        expect(permutations).not.toBe(values);
        expect(values).toEqual([1, 2, 3]);
    });

    it("permutes a prefix and repeats duplicate values by index", () => {
        expect(getPermutations({ array: [1, 2, 3], size: 2 })).toEqual([
            [1, 2],
            [1, 3],
            [2, 1],
            [2, 3],
            [3, 1],
            [3, 2],
        ]);
        expect(getPermutations({ array: ["x", "x"] })).toEqual([
            ["x", "x"],
            ["x", "x"],
        ]);
    });

    it("returns one empty permutation when size is 0", () => {
        expect(getPermutations({ array: [1, 2], size: 0 })).toEqual([[]]);
    });

    it("returns an empty array when size is greater than the length", () => {
        expect(getPermutations({ array: [1], size: 2 })).toEqual([]);
    });

    it("returns undefined when array is not an array", () => {
        expect(
            getPermutations({ array: null, size: 1 } as never),
        ).toBeUndefined();
    });

    it("throws when size is not a non-negative integer", () => {
        expect(() => getPermutations({ array: [1], size: -1 })).toThrow(
            RangeError,
        );
    });
});
