import { describe, expect, it } from "vitest";
import { removeAt } from "../remove-at/remove-at.js";
import { insertItem } from "./insert-item.js";

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

describe("insertItem", () => {
    it("inserts an item at an index", () => {
        expect(insertItem({ array: [1, 2, 3], index: 1, item: 9 })).toEqual([
            1, 9, 2, 3,
        ]);
    });

    it("appends when the index equals the length", () => {
        expect(insertItem({ array: [1, 2], index: 2, item: 3 })).toEqual([
            1, 2, 3,
        ]);
    });

    it("counts a negative index from the end", () => {
        expect(insertItem({ array: [1, 2, 3], index: -1, item: 9 })).toEqual([
            1, 2, 9, 3,
        ]);
    });

    it("inserts into an empty array at index 0", () => {
        expect(insertItem({ array: [], index: 0, item: 1 })).toEqual([1]);
    });

    it("returns undefined for an empty array and an out-of-range index", () => {
        expect(insertItem({ array: [], index: 1, item: 1 })).toBeUndefined();
        expect(insertItem({ array: [], index: -1, item: 1 })).toBeUndefined();
    });

    it("returns undefined for a non-integer or out-of-range index", () => {
        expect(insertItem({ array: [1], index: 1.5, item: 2 })).toBeUndefined();
        expect(
            insertItem({ array: [1], index: Number.NaN, item: 2 }),
        ).toBeUndefined();
        expect(insertItem({ array: [1], index: 2, item: 2 })).toBeUndefined();
        expect(insertItem({ array: [1], index: -2, item: 2 })).toBeUndefined();
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(insertItem(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = insertItem({ array, index: 0, item: 0 });

        expect(result).toEqual([0, 1, 2, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined in a new dense array", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = insertItem({ array, index: 3, item: 4 });

        expect(result).toEqual([1, undefined, 3, 4]);
        expect(result).not.toBe(array);
        expect(1 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });

    it("recovers the original items when removeAt uses the same index", () => {
        const original = [1, 2, 3, 4];
        const inserted = insertItem({ array: original, index: 2, item: 9 });
        const removed = removeAt({ array: inserted ?? [], index: 2 });

        expect(removed).toEqual([...original]);
        expect(removed).not.toBe(original);
    });
});
