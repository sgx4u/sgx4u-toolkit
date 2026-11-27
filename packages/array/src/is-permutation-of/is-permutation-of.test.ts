import { describe, expect, it } from "vitest";
import type { IsPermutationOfParams } from "./is-permutation-of.types.js";
import { isPermutationOf } from "./is-permutation-of.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("isPermutationOf", () => {
    it("matches the same items and multiplicities in any order", () => {
        const params: IsPermutationOfParams<number> = {
            array: [1, 2, 1],
            other: [1, 1, 2],
        };
        expect(isPermutationOf(params)).toBe(true);
        expect(isPermutationOf({ array: [1, 1], other: [1] })).toBe(false);
        expect(isPermutationOf({ array: [1, 2], other: [1, 2, 2] })).toBe(
            false,
        );
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            isPermutationOf({
                array: [Number.NaN, 0, Number.NaN],
                other: [-0, Number.NaN, Number.NaN],
            }),
        ).toBe(true);
        expect(
            isPermutationOf({
                array: [Number.NaN, Number.NaN],
                other: [Number.NaN, 1],
            }),
        ).toBe(false);
    });

    it("uses a custom equals function", () => {
        expect(
            isPermutationOf({
                array: ["a", "B", "b"],
                other: ["A", "b", "b"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toBe(true);
    });

    it("returns false for invalid input and never throws", () => {
        const invalidValues = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const value of invalidValues) {
            expect(isPermutationOf(value)).toBe(false);
        }
        expect(
            isPermutationOf({
                array: [1],
                other: [1],
                equals: "nope" as never,
            }),
        ).toBe(false);
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2]);
        const other = Object.freeze([2, 1]);
        expect(isPermutationOf({ array, other })).toBe(true);
        expect(array).toEqual([1, 2]);
        expect(other).toEqual([2, 1]);
    });

    it("treats holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 2;
        expect(
            isPermutationOf({ array: sparse, other: [2, undefined, 1] }),
        ).toBe(true);
    });
});
