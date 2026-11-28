import { describe, expect, it } from "vitest";
import { takeLast } from "./take-last.js";
import type { TakeLastParams } from "./take-last.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("takeLast", () => {
    it("returns the last count items in their original order", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: TakeLastParams<number> = { array: input, count: 2 };
        const result = takeLast(params);

        expect(result).toEqual([3, 4]);
        expect(result).not.toBe(input);
        expect(takeLast({ array: [1], count: 1 })).toEqual([1]);
        expect(takeLast({ array: [], count: 2 })).toEqual([]);
        expect(takeLast({ array: [1, 2], count: 0 })).toEqual([]);
        expect(takeLast({ array: [1, 2], count: 10 })).toEqual([1, 2]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(takeLast({ array: sparse, count: 2 })).toEqual([undefined, 3]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(takeLast(null)).toBeUndefined();
        expect(takeLast("text")).toBeUndefined();
        expect(takeLast({ array: "text", count: 1 })).toBeUndefined();
    });

    it("throws when count is missing or unusable", () => {
        expect(() => takeLast({})).toThrow(TypeError);
        expect(() => takeLast(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => takeLast(new Set([1]))).toThrow(TypeError);
        expect(() => takeLast(oneNumber())).toThrow(TypeError);
        expect(() => takeLast({ array: [1], count: -1 })).toThrow(RangeError);
        expect(() => takeLast({ array: [1], count: Number.NaN })).toThrow(
            RangeError,
        );
    });
});
