import { describe, expect, it } from "vitest";
import { setAt } from "./set-at.js";

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

describe("setAt", () => {
    it("replaces the item at an index", () => {
        expect(setAt({ array: [1, 2, 3], index: 1, value: 9 })).toEqual([
            1, 9, 3,
        ]);
    });

    it("counts a negative index from the end", () => {
        expect(setAt({ array: [1, 2, 3], index: -1, value: 9 })).toEqual([
            1, 2, 9,
        ]);
    });

    it("stores a function value", () => {
        const value = () => 1;
        const array: Array<number | typeof value> = [1];
        const result = setAt({ array, index: 0, value });

        expect(result?.[0]).toBe(value);
    });

    it("returns undefined for an out-of-range or non-integer index", () => {
        expect(setAt({ array: [1], index: 1, value: 2 })).toBeUndefined();
        expect(setAt({ array: [1], index: -2, value: 2 })).toBeUndefined();
        expect(setAt({ array: [1], index: 1.5, value: 2 })).toBeUndefined();
        expect(setAt({ array: [], index: 0, value: 1 })).toBeUndefined();
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(setAt(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = setAt({ array, index: 0, value: 9 });

        expect(result).toEqual([9, 2, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = setAt({ array, index: 0, value: 9 });

        expect(result).toEqual([9, undefined, 3]);
        expect(1 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
