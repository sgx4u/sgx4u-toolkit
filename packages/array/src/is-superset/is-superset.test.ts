import { describe, expect, it } from "vitest";
import type { IsSupersetParams } from "./is-superset.types.js";
import { isSuperset } from "./is-superset.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("isSuperset", () => {
    it("is true when array contains every item of of", () => {
        const params: IsSupersetParams<number> = {
            array: [1, 2, 2],
            of: [2, 1],
        };
        expect(isSuperset(params)).toBe(true);
        expect(isSuperset({ array: [1], of: [1, 2] })).toBe(false);
    });

    it("treats an empty of as contained", () => {
        expect(isSuperset({ array: [1], of: [] })).toBe(true);
        expect(isSuperset({ array: [], of: [] })).toBe(true);
        expect(isSuperset({ array: [], of: [1] })).toBe(false);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            isSuperset({ array: [0, Number.NaN], of: [-0, Number.NaN] }),
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
            expect(isSuperset(value)).toBe(false);
        }
        expect(
            isSuperset({ array: [1], of: [1], equals: "nope" as never }),
        ).toBe(false);
        expect(isSuperset(generate)).toBe(false);
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2]);
        const of = Object.freeze([2]);
        expect(isSuperset({ array, of })).toBe(true);
        expect(array).toEqual([1, 2]);
    });

    it("treats holes as undefined", () => {
        const sparse: number[] = [];
        sparse[1] = 2;
        expect(isSuperset({ array: sparse, of: [undefined, 2] })).toBe(true);
    });
});
