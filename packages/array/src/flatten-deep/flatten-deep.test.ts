import { describe, expect, it } from "vitest";
import { flattenDeep } from "./flatten-deep.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

const invalidInputs: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    ["a generator", generate()],
];

describe("flattenDeep", () => {
    it("opens nested arrays until none remain", () => {
        expect(flattenDeep([1, [2, [3, [4]]], 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it("returns a new empty array for an empty array", () => {
        const array: unknown[] = [];
        const result = flattenDeep(array);

        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("leaves a set and a typed array in place", () => {
        const values = new Set([1]);
        const typed = new Uint8Array([2]);
        expect(flattenDeep([values, [typed, ["a"]]])).toEqual([
            values,
            typed,
            "a",
        ]);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(flattenDeep(value as never)).toBeUndefined();
    });

    it("returns undefined for a function", () => {
        expect(flattenDeep(generate as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const nested = Object.freeze([2, Object.freeze([3])]);
        const array = Object.freeze([1, nested]);
        const result = flattenDeep(array);

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, nested]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , [3]] as unknown[];
        expect(flattenDeep(array)).toEqual([1, undefined, 3]);
        expect(1 in array).toBe(false);
    });
});
