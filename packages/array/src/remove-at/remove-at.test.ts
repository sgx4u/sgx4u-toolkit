import { describe, expect, it } from "vitest";
import { removeAt } from "./remove-at.js";

const invalidInputs: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    [
        "a generator",
        (function* generate() {
            yield 1;
        })(),
    ],
];

describe("removeAt", () => {
    it("removes one item by default", () => {
        expect(removeAt({ array: [1, 2, 3], index: 1 })).toEqual([1, 3]);
    });

    it("removes count items starting at the index", () => {
        expect(removeAt({ array: [1, 2, 3, 4], index: 1, count: 2 })).toEqual([
            1, 4,
        ]);
    });

    it("counts a negative index from the end", () => {
        expect(removeAt({ array: [1, 2, 3, 4], index: -2, count: 2 })).toEqual([
            1, 2,
        ]);
    });

    it("removes through the end when count extends past the array", () => {
        expect(removeAt({ array: [1, 2, 3], index: 1, count: 10 })).toEqual([
            1,
        ]);
    });

    it("returns a shallow copy when count is 0 and the index is in range", () => {
        const array = [1, 2, 3];
        const result = removeAt({ array, index: 3, count: 0 });

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
        expect(removeAt({ array, index: -1, count: 0 })).toEqual([1, 2, 3]);
    });

    it("returns a copy of an empty array when count is 0 and the index is 0", () => {
        const array: number[] = [];
        const result = removeAt({ array, index: 0, count: 0 });

        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for an out-of-range index", () => {
        expect(removeAt({ array: [1, 2], index: 2 })).toBeUndefined();
        expect(removeAt({ array: [1, 2], index: -3 })).toBeUndefined();
        expect(removeAt({ array: [], index: 0 })).toBeUndefined();
        expect(removeAt({ array: [1], index: 2, count: 0 })).toBeUndefined();
        expect(removeAt({ array: [1], index: 1.2 })).toBeUndefined();
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(removeAt(value as never)).toBeUndefined();
    });

    it("throws when count is not a non-negative integer", () => {
        expect(() => removeAt({ array: [1], index: 0, count: -1 })).toThrow(
            RangeError,
        );
        expect(() => removeAt({ array: [1], index: 0, count: 1.5 })).toThrow(
            RangeError,
        );
        expect(() =>
            removeAt({ array: [1], index: 0, count: "1" as never }),
        ).toThrow(TypeError);
        expect(() => removeAt({ count: -1 } as never)).toThrow(RangeError);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = removeAt({ array, index: 0 });

        expect(result).toEqual([2, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = removeAt({ array, index: 0 });

        expect(result).toEqual([undefined, 3]);
        expect(0 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
