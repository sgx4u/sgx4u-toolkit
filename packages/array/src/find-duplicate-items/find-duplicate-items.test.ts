import { describe, expect, it } from "vitest";
import type { FindDuplicateItemsParams } from "./find-duplicate-items.types.js";
import { findDuplicateItems } from "./find-duplicate-items.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("findDuplicateItems", () => {
    it("returns the first occurrence of each repeated value", () => {
        const params: FindDuplicateItemsParams<number> = {
            array: [1, 2, 1, 3, 2],
        };
        const result = findDuplicateItems(params);
        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(params.array);
    });

    it("returns an empty array when nothing is repeated", () => {
        expect(findDuplicateItems({ array: [] })).toEqual([]);
        expect(findDuplicateItems({ array: [1, 2, 3] })).toEqual([]);
        const array: number[] = [];
        expect(findDuplicateItems({ array })).not.toBe(array);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            findDuplicateItems({
                array: [Number.NaN, 1, Number.NaN, 0, -0],
            }),
        ).toEqual([Number.NaN, 0]);
    });

    it("lets by win over equals", () => {
        expect(
            findDuplicateItems({
                array: [
                    { id: 1, name: "a" },
                    { id: 2, name: "b" },
                    { id: 1, name: "c" },
                ],
                by: "id",
                equals: () => false,
            }),
        ).toEqual([{ id: 1, name: "a" }]);
    });

    it("uses a custom equals function", () => {
        expect(
            findDuplicateItems({
                array: ["a", "B", "b"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["B"]);
    });

    it("returns undefined for a non-array", () => {
        expect(findDuplicateItems(null)).toBeUndefined();
        expect(findDuplicateItems({})).toBeUndefined();
        expect(findDuplicateItems("text")).toBeUndefined();
        expect(findDuplicateItems(new Uint8Array([1]))).toBeUndefined();
        expect(findDuplicateItems(new Set([1]))).toBeUndefined();
        expect(findDuplicateItems(generate())).toBeUndefined();
        expect(findDuplicateItems({ array: "text" as never })).toBeUndefined();
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2, 1]);
        expect(findDuplicateItems({ array })).toEqual([1]);
        expect(array).toEqual([1, 2, 1]);
    });

    it("reads holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 1;
        expect(findDuplicateItems({ array: sparse })).toEqual([1]);
        const holes: number[] = [];
        holes[2] = 1;
        expect(findDuplicateItems({ array: holes })).toEqual([undefined]);
    });

    it("throws when by or equals is invalid", () => {
        expect(() =>
            findDuplicateItems({ array: [1, 1], by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            findDuplicateItems({ array: [1, 1], equals: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            findDuplicateItems({ array: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });
});
