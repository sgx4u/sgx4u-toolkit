import { describe, expect, it } from "vitest";
import { isTypedArray } from "./is-typed-array.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("isTypedArray", () => {
    it("accepts typed arrays and rejects DataView", () => {
        expect(isTypedArray(new Uint8Array([1]))).toBe(true);
        expect(isTypedArray(new Int32Array([1]))).toBe(true);
        expect(isTypedArray(new Float64Array([1]))).toBe(true);
        expect(isTypedArray(new DataView(new ArrayBuffer(8)))).toBe(false);
    });

    it("returns false for other values", () => {
        expect(isTypedArray([])).toBe(false);
        expect(isTypedArray([1])).toBe(false);
        expect(isTypedArray(null)).toBe(false);
        expect(isTypedArray({})).toBe(false);
        expect(isTypedArray("text")).toBe(false);
        expect(isTypedArray(new Set([1]))).toBe(false);
        expect(isTypedArray(oneNumber())).toBe(false);
    });

    it("does not mutate a typed array", () => {
        const input = new Uint8Array([1, 2]);
        expect(isTypedArray(input)).toBe(true);
        expect(Array.from(input)).toEqual([1, 2]);
    });
});
