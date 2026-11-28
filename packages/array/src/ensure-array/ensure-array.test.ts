import { describe, expect, it } from "vitest";
import { ensureArray } from "./ensure-array.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("ensureArray", () => {
    it("returns an empty array for null and undefined", () => {
        expect(ensureArray(null)).toEqual([]);
        expect(ensureArray(undefined)).toEqual([]);
        expect(ensureArray<number>(null)).not.toBe(ensureArray<number>(null));
    });

    it("copies a real array and fills holes", () => {
        const input = Object.freeze([1, 2, 3]);
        const result = ensureArray(input);
        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(input);

        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(ensureArray(sparse)).toEqual([1, undefined, 3]);
        expect(ensureArray([])).toEqual([]);
        expect(ensureArray([1])).toEqual([1]);
    });

    it("wraps every other value in a one-element array", () => {
        const typed = new Uint8Array([1]);
        const set = new Set([1]);
        const generator = oneNumber();
        const item = { value: 1 };

        expect(ensureArray("text")).toEqual(["text"]);
        expect(ensureArray(0)).toEqual([0]);
        expect(ensureArray(false)).toEqual([false]);
        const wrappedGenerator = ensureArray(generator);

        expect(ensureArray(typed)).toEqual([typed]);
        expect(ensureArray(set)).toEqual([set]);
        expect(wrappedGenerator).toHaveLength(1);
        expect(wrappedGenerator[0]).toBe(generator);
        expect(ensureArray(item)).toEqual([item]);
        expect(ensureArray({})[0]).toEqual({});
    });
});
