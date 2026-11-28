import { describe, expect, it } from "vitest";
import type { FindDuplicateIndexesParams } from "./find-duplicate-indexes.types.js";
import { findDuplicateIndexes } from "./find-duplicate-indexes.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("findDuplicateIndexes", () => {
    it("returns every index of a repeated value, ascending", () => {
        const params: FindDuplicateIndexesParams<number> = {
            array: [1, 2, 1, 3, 2],
        };
        const result = findDuplicateIndexes(params);
        expect(result).toEqual([0, 1, 2, 4]);
        expect(result).not.toBe(params.array);
    });

    it("returns an empty array when nothing is repeated", () => {
        expect(findDuplicateIndexes({ array: [] })).toEqual([]);
        expect(findDuplicateIndexes({ array: [1, 2, 3] })).toEqual([]);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            findDuplicateIndexes({
                array: [Number.NaN, 1, 0, Number.NaN, -0],
            }),
        ).toEqual([0, 2, 3, 4]);
    });

    it("lets by win over equals", () => {
        expect(
            findDuplicateIndexes({
                array: [{ id: 1 }, { id: 2 }, { id: 1 }],
                by: "id",
                equals: () => false,
            }),
        ).toEqual([0, 2]);
    });

    it("uses a custom equals function", () => {
        expect(
            findDuplicateIndexes({
                array: ["a", "B", "b"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual([1, 2]);
    });

    it("returns undefined for a non-array", () => {
        expect(findDuplicateIndexes(null)).toBeUndefined();
        expect(findDuplicateIndexes({})).toBeUndefined();
        expect(findDuplicateIndexes("text")).toBeUndefined();
        expect(findDuplicateIndexes(new Uint8Array([1]))).toBeUndefined();
        expect(findDuplicateIndexes(new Set([1]))).toBeUndefined();
        expect(findDuplicateIndexes(generate())).toBeUndefined();
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2, 1, 3, 2]);
        expect(findDuplicateIndexes({ array })).toEqual([0, 1, 2, 4]);
        expect(array).toEqual([1, 2, 1, 3, 2]);
    });

    it("reads holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 1;
        expect(findDuplicateIndexes({ array: sparse })).toEqual([0, 2]);
        const repeated: number[] = [];
        repeated[2] = 1;
        expect(findDuplicateIndexes({ array: repeated })).toEqual([0, 1]);
    });

    it("throws when by or equals is invalid", () => {
        expect(() =>
            findDuplicateIndexes({ array: [1, 1], by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            findDuplicateIndexes({ array: [1, 1], equals: "nope" as never }),
        ).toThrow(TypeError);
    });
});
