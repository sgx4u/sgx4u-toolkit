import { describe, expect, it } from "vitest";
import { drop } from "./drop.js";
import type { DropParams } from "./drop.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("drop", () => {
    it("drops the first count items", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: DropParams<number> = { array: input, count: 1 };
        const result = drop(params);

        expect(result).toEqual([2, 3, 4]);
        expect(result).not.toBe(input);
        expect(drop({ array: [1], count: 1 })).toEqual([]);
        expect(drop({ array: [], count: 1 })).toEqual([]);
        expect(drop({ array: [1, 2], count: 0 })).toEqual([1, 2]);
        expect(drop({ array: [1, 2], count: 0 })).not.toBe(input);
        expect(drop({ array: [1, 2], count: 10 })).toEqual([]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(drop({ array: sparse, count: 1 })).toEqual([undefined, 3]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(drop(null)).toBeUndefined();
        expect(drop("text")).toBeUndefined();
        expect(drop({ array: "text", count: 1 })).toBeUndefined();
    });

    it("throws when count is missing or unusable", () => {
        expect(() => drop({})).toThrow(TypeError);
        expect(() => drop(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => drop(new Set([1]))).toThrow(TypeError);
        expect(() => drop(oneNumber())).toThrow(TypeError);
        expect(() => drop({ array: [1], count: -1 })).toThrow(RangeError);
        expect(() =>
            drop({ array: [1], count: "1" as unknown as number }),
        ).toThrow(TypeError);
    });
});
