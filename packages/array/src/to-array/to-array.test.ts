import { describe, expect, it } from "vitest";
import { toArray } from "./to-array.js";

function* numbers(): Generator<number> {
    yield 1;
    yield 2;
}

describe("toArray", () => {
    it("copies an array into a new dense array", () => {
        const input = Object.freeze([1, 2]);
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;

        const result = toArray(input);
        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(input);
        expect(toArray([])).toEqual([]);
        expect(toArray([1])).toEqual([1]);
        expect(toArray(sparse)).toEqual([1, undefined, 3]);
    });

    it("copies strings, typed arrays, iterables, and array-like objects", () => {
        expect(toArray("text")).toEqual(["t", "e", "x", "t"]);
        expect(toArray("")).toEqual([]);
        expect(toArray(new Uint8Array([1]))).toEqual([1]);
        expect(toArray(new Set([1]))).toEqual([1]);
        expect(toArray(numbers())).toEqual([1, 2]);
        expect(toArray({ length: 3, 0: "a", 2: "c" })).toEqual([
            "a",
            undefined,
            "c",
        ]);
    });

    it("returns undefined for null, functions, and plain objects", () => {
        expect(toArray(null)).toBeUndefined();
        expect(toArray(undefined)).toBeUndefined();
        expect(toArray({})).toBeUndefined();
        expect(toArray(() => undefined)).toBeUndefined();
        expect(toArray(new DataView(new ArrayBuffer(8)))).toBeUndefined();
    });
});
