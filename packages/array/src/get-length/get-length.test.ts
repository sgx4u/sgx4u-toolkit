import { describe, expect, it } from "vitest";
import { getLength } from "./get-length.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getLength", () => {
    it("returns the length of arrays, strings, typed arrays, and array-likes", () => {
        const input = Object.freeze([1, 2]);
        expect(getLength([])).toBe(0);
        expect(getLength([1])).toBe(1);
        expect(getLength(input)).toBe(2);
        expect(getLength("text")).toBe(4);
        expect(getLength("")).toBe(0);
        expect(getLength(new Uint8Array([1]))).toBe(1);
        expect(getLength({ length: 2 })).toBe(2);
        expect(getLength({ length: Number.MAX_SAFE_INTEGER })).toBe(
            Number.MAX_SAFE_INTEGER,
        );
        expect(input).toEqual([1, 2]);
    });

    it("returns undefined when the value is not array-like", () => {
        expect(getLength(null)).toBeUndefined();
        expect(getLength(undefined)).toBeUndefined();
        expect(getLength({})).toBeUndefined();
        expect(getLength({ length: 1.5 })).toBeUndefined();
        expect(getLength({ length: -1 })).toBeUndefined();
        expect(getLength(() => undefined)).toBeUndefined();
        expect(getLength(new Set([1]))).toBeUndefined();
        expect(getLength(oneNumber())).toBeUndefined();
        expect(getLength("text")).not.toBeUndefined();
    });
});
