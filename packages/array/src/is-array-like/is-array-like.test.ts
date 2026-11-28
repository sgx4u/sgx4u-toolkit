import { describe, expect, it } from "vitest";
import { isArrayLike } from "./is-array-like.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("isArrayLike", () => {
    it("accepts arrays, strings, typed arrays, and array-like objects", () => {
        expect(isArrayLike([])).toBe(true);
        expect(isArrayLike([1])).toBe(true);
        expect(isArrayLike("text")).toBe(true);
        expect(isArrayLike("")).toBe(true);
        expect(isArrayLike(new Uint8Array([1]))).toBe(true);
        expect(isArrayLike({ length: 0 })).toBe(true);
        expect(isArrayLike({ length: 2 })).toBe(true);
        expect(isArrayLike({ length: Number.MAX_SAFE_INTEGER })).toBe(true);
    });

    it("rejects values whose length is missing or out of range", () => {
        expect(isArrayLike(null)).toBe(false);
        expect(isArrayLike(undefined)).toBe(false);
        expect(isArrayLike({})).toBe(false);
        expect(isArrayLike({ length: -1 })).toBe(false);
        expect(isArrayLike({ length: 1.5 })).toBe(false);
        expect(isArrayLike({ length: Number.MAX_SAFE_INTEGER + 1 })).toBe(
            false,
        );
        expect(isArrayLike(() => undefined)).toBe(false);
        expect(isArrayLike(new Set([1]))).toBe(false);
        expect(isArrayLike(oneNumber())).toBe(false);
        expect(isArrayLike(new DataView(new ArrayBuffer(8)))).toBe(false);
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2]);
        expect(isArrayLike(input)).toBe(true);
        expect(input).toEqual([1, 2]);
    });
});
