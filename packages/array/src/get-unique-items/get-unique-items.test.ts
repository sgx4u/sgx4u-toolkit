import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { GetUniqueItemsParams } from "./get-unique-items.types.js";
import { getUniqueItems } from "./get-unique-items.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 1;
    return array;
}

describe("getUniqueItems", () => {
    it("keeps the first occurrence of a bare array", () => {
        const array = [1, 2, 1, 3];
        const result = getUniqueItems(array);
        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
    });

    it("keeps the last occurrence in the order those items appear", () => {
        const params: GetUniqueItemsParams<number> = {
            array: [1, 2, 1],
            keep: "last",
        };
        expect(getUniqueItems(params)).toEqual([2, 1]);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(getUniqueItems([Number.NaN, Number.NaN, 0, -0])).toEqual([
            Number.NaN,
            0,
        ]);
        expect(
            getUniqueItems({
                array: [Number.NaN, 1, Number.NaN, 0, -0],
                keep: "last",
            }),
        ).toEqual([1, Number.NaN, -0]);
    });

    it("uses a custom equals function", () => {
        expect(
            getUniqueItems({
                array: ["a", "B", "b"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["a", "B"]);
    });

    it("returns an empty array for an empty array", () => {
        const array: number[] = [];
        const result = getUniqueItems(array);
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(getUniqueItems(null)).toBeUndefined();
        expect(getUniqueItems("text")).toBeUndefined();
        expect(getUniqueItems({})).toBeUndefined();
        expect(getUniqueItems(new Uint8Array([1]))).toBeUndefined();
        expect(getUniqueItems(new Set([1]))).toBeUndefined();
        expect(getUniqueItems(generate())).toBeUndefined();
        expect(getUniqueItems(generate)).toBeUndefined();
        expect(getUniqueItems({ array: "text" as never })).toBeUndefined();
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 1, 2]);
        expect(getUniqueItems(array)).toEqual([1, 2]);
        expect(array).toEqual([1, 1, 2]);
    });

    it("copies holes as undefined", () => {
        expect(getUniqueItems(sparse())).toEqual([1, undefined]);
    });

    it("throws when keep or equals is invalid", () => {
        expect(() =>
            getUniqueItems({ array: [1, 1], keep: "middle" as never }),
        ).toThrow(RangeError);
        expect(() =>
            getUniqueItems({ array: [1], equals: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            getUniqueItems({ array: "text" as never, keep: "nope" as never }),
        ).toThrow(RangeError);
    });

    it("is idempotent for integer arrays", () => {
        fc.assert(
            fc.property(fc.array(fc.integer()), (values) => {
                const once = getUniqueItems(values);
                const twice = getUniqueItems(once ?? []);
                expect(twice).toEqual(once);
            }),
        );
    });
});
