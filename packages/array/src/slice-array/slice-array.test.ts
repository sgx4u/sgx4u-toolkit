import { describe, expect, it } from "vitest";
import { sliceArray } from "./slice-array.js";
import type { SliceArrayParams } from "./slice-array.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("sliceArray", () => {
    it("follows Array#slice index rules on a dense copy", () => {
        const input = Object.freeze([0, 1, 2, 3, 4]);
        const params: SliceArrayParams<number> = {
            array: input,
            start: 1,
            end: 3,
        };
        const result = sliceArray(params);

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(input);
        expect(sliceArray({ array: input, start: -2 })).toEqual([3, 4]);
        expect(sliceArray({ array: input, end: -1 })).toEqual([0, 1, 2, 3]);
        expect(sliceArray({ array: input, start: 1.9, end: 4.2 })).toEqual([
            1, 2, 3,
        ]);
        expect(sliceArray({ array: input, start: -2.8 })).toEqual([3, 4]);
        expect(sliceArray({ array: input, start: 10 })).toEqual([]);
        expect(sliceArray({ array: input, start: -10 })).toEqual([
            0, 1, 2, 3, 4,
        ]);
        expect(sliceArray({ array: input })).toEqual([0, 1, 2, 3, 4]);
        expect(sliceArray({ array: input })).not.toBe(input);
        expect(sliceArray({ array: [] })).toEqual([]);
        expect(sliceArray({ array: [1], start: 0, end: 1 })).toEqual([1]);
        expect(input).toEqual([0, 1, 2, 3, 4]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(sliceArray({ array: sparse })).toEqual([1, undefined, 3]);
        expect(sliceArray({ array: sparse, start: 1, end: 2 })).toEqual([
            undefined,
        ]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(sliceArray(null)).toBeUndefined();
        expect(sliceArray("text")).toBeUndefined();
        expect(sliceArray({})).toBeUndefined();
        expect(sliceArray({ array: "text" })).toBeUndefined();
        expect(sliceArray(new Uint8Array([1]))).toBeUndefined();
        expect(sliceArray(new Set([1]))).toBeUndefined();
        expect(sliceArray(oneNumber())).toBeUndefined();
    });

    it("throws when start or end is not a finite number", () => {
        expect(() => sliceArray({ array: [1], start: Number.NaN })).toThrow(
            RangeError,
        );
        expect(() =>
            sliceArray({ array: [1], end: Number.POSITIVE_INFINITY }),
        ).toThrow("`end` must be a finite number; received Infinity.");
        expect(() =>
            sliceArray({ array: [1], start: "1" as unknown as number }),
        ).toThrow(TypeError);
        expect(() => sliceArray({ array: "no", start: Number.NaN })).toThrow(
            RangeError,
        );
    });
});
