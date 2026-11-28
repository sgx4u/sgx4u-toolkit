import { describe, expect, it } from "vitest";
import type { IsSubsetParams } from "./is-subset.types.js";
import { isSubset } from "./is-subset.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 1;
    return array;
}

describe("isSubset", () => {
    it("is true when every item appears in of", () => {
        const params: IsSubsetParams<number> = {
            array: [1, 1],
            of: [1, 2],
        };
        expect(isSubset(params)).toBe(true);
        expect(isSubset({ array: [1, 3], of: [1, 2] })).toBe(false);
    });

    it("treats an empty array as a subset", () => {
        expect(isSubset({ array: [], of: [1] })).toBe(true);
        expect(isSubset({ array: [], of: [] })).toBe(true);
        expect(isSubset({ array: [1], of: [] })).toBe(false);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(isSubset({ array: [Number.NaN, -0], of: [0, Number.NaN] })).toBe(
            true,
        );
    });

    it("uses a custom equals function", () => {
        expect(
            isSubset({
                array: ["A"],
                of: ["a"],
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
            expect(isSubset(value)).toBe(false);
        }
        expect(isSubset({ array: [1], of: "text" as never })).toBe(false);
        expect(isSubset({ array: [1], of: [1], equals: "nope" as never })).toBe(
            false,
        );
        expect(isSubset(generate)).toBe(false);
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 1]);
        const of = Object.freeze([1]);
        expect(isSubset({ array, of })).toBe(true);
        expect(array).toEqual([1, 1]);
    });

    it("treats holes as undefined", () => {
        expect(isSubset({ array: sparse(), of: [1, undefined] })).toBe(true);
        expect(isSubset({ array: sparse(), of: [1] })).toBe(false);
    });
});
