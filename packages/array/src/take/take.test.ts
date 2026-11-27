import { describe, expect, it } from "vitest";
import { take } from "./take.js";
import type { TakeParams } from "./take.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("take", () => {
    it("returns the first count items", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: TakeParams<number> = { array: input, count: 2 };
        const result = take(params);

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(input);
        expect(take({ array: [1], count: 1 })).toEqual([1]);
        expect(take({ array: [], count: 2 })).toEqual([]);
        expect(take({ array: [1, 2], count: 0 })).toEqual([]);
        expect(take({ array: [1, 2], count: 10 })).toEqual([1, 2]);
        expect(take({ array: [1, 2], count: 10 })).not.toBe(params.array);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(take({ array: sparse, count: 3 })).toEqual([1, undefined, 3]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(take(null)).toBeUndefined();
        expect(take("text")).toBeUndefined();
        expect(take({ array: "text", count: 1 })).toBeUndefined();
    });

    it("throws when count is missing or unusable", () => {
        expect(() => take({})).toThrow(TypeError);
        expect(() => take(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => take(new Set([1]))).toThrow(TypeError);
        expect(() => take(oneNumber())).toThrow(TypeError);
        expect(() => take({ array: [1], count: -1 })).toThrow(
            "`count` must be a finite integer greater than or equal to 0; received -1.",
        );
        expect(() => take({ array: [1], count: 1.5 })).toThrow(RangeError);
        expect(() =>
            take({ array: [1], count: "2" as unknown as number }),
        ).toThrow(TypeError);
        expect(() => take({ array: "no", count: -1 })).toThrow(RangeError);
    });
});
