import { describe, expect, it } from "vitest";
import type { IsEqualArrayParams } from "./is-equal-array.types.js";
import { isEqualArray } from "./is-equal-array.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("isEqualArray", () => {
    it("requires the same items in the same order", () => {
        const params: IsEqualArrayParams<number> = {
            first: [1, 2, 3],
            second: [1, 2, 3],
        };
        expect(isEqualArray(params)).toBe(true);
        expect(isEqualArray({ first: [1, 2], second: [2, 1] })).toBe(false);
        expect(isEqualArray({ first: [1], second: [1, 1] })).toBe(false);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            isEqualArray({
                first: [1, Number.NaN, 0],
                second: [1, Number.NaN, -0],
            }),
        ).toBe(true);
    });

    it("uses a custom equals function", () => {
        expect(
            isEqualArray({
                first: ["A", "b"],
                second: ["a", "B"],
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
            expect(isEqualArray(value)).toBe(false);
        }
        expect(
            isEqualArray({ first: [1], second: [1], equals: "nope" as never }),
        ).toBe(false);
        expect(isEqualArray({ first: [1], second: "text" as never })).toBe(
            false,
        );
    });

    it("does not mutate a frozen input", () => {
        const first = Object.freeze([1, 2]);
        const second = Object.freeze([1, 2]);
        expect(isEqualArray({ first, second })).toBe(true);
        expect(first).toEqual([1, 2]);
    });

    it("treats holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(isEqualArray({ first: sparse, second: [1, undefined, 3] })).toBe(
            true,
        );
        expect(isEqualArray({ first: sparse, second: [1, 3] })).toBe(false);
    });
});
