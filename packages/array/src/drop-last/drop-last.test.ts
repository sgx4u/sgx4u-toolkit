import { describe, expect, it } from "vitest";
import { dropLast } from "./drop-last.js";
import type { DropLastParams } from "./drop-last.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("dropLast", () => {
    it("drops the last count items", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: DropLastParams<number> = { array: input, count: 1 };
        const result = dropLast(params);

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(input);
        expect(dropLast({ array: [1], count: 1 })).toEqual([]);
        expect(dropLast({ array: [], count: 1 })).toEqual([]);
        expect(dropLast({ array: [1, 2], count: 0 })).toEqual([1, 2]);
        expect(dropLast({ array: [1, 2], count: 10 })).toEqual([]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(dropLast({ array: sparse, count: 1 })).toEqual([1, undefined]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(dropLast(null)).toBeUndefined();
        expect(dropLast("text")).toBeUndefined();
        expect(dropLast({ array: "text", count: 1 })).toBeUndefined();
    });

    it("throws when count is missing or unusable", () => {
        expect(() => dropLast({})).toThrow(TypeError);
        expect(() => dropLast(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => dropLast(new Set([1]))).toThrow(TypeError);
        expect(() => dropLast(oneNumber())).toThrow(TypeError);
        expect(() => dropLast({ array: [1], count: -1 })).toThrow(RangeError);
    });
});
