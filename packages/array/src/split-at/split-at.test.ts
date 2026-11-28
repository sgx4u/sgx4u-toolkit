import { describe, expect, it } from "vitest";
import { splitAt } from "./split-at.js";
import type { SplitAtParams } from "./split-at.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("splitAt", () => {
    it("splits at a clamped index", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: SplitAtParams<number> = { array: input, index: 2 };
        const result = splitAt(params);

        expect(result).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(result?.[0]).not.toBe(input);
        expect(result?.[1]).not.toBe(input);
        expect(result?.[0]).not.toBe(result?.[1]);
        expect(splitAt({ array: input, index: -1 })).toEqual([[1, 2, 3], [4]]);
        expect(splitAt({ array: input, index: 0 })).toEqual([[], [1, 2, 3, 4]]);
        expect(splitAt({ array: input, index: 4 })).toEqual([[1, 2, 3, 4], []]);
        expect(splitAt({ array: input, index: 100 })).toEqual([
            [1, 2, 3, 4],
            [],
        ]);
        expect(splitAt({ array: input, index: -100 })).toEqual([
            [],
            [1, 2, 3, 4],
        ]);
        expect(splitAt({ array: input, index: 1.9 })).toEqual([[1], [2, 3, 4]]);
        expect(splitAt({ array: input, index: -1.2 })).toEqual([
            [1, 2, 3],
            [4],
        ]);
        expect(splitAt({ array: [], index: 0 })).toEqual([[], []]);
        expect(splitAt({ array: [1], index: 1 })).toEqual([[1], []]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(splitAt({ array: sparse, index: 2 })).toEqual([
            [1, undefined],
            [3],
        ]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(splitAt(null)).toBeUndefined();
        expect(splitAt("text")).toBeUndefined();
        expect(splitAt({ index: 1 })).toBeUndefined();
        expect(splitAt({ array: "text", index: 1 })).toBeUndefined();
    });

    it("throws when index is not a finite number", () => {
        expect(() => splitAt({})).toThrow(TypeError);
        expect(() => splitAt(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => splitAt(new Set([1]))).toThrow(TypeError);
        expect(() => splitAt(oneNumber())).toThrow(TypeError);
        expect(() => splitAt({ array: [1, 2], index: Number.NaN })).toThrow(
            "`index` must be a finite number; received NaN.",
        );
        expect(() =>
            splitAt({ array: [1], index: Number.POSITIVE_INFINITY }),
        ).toThrow(RangeError);
        expect(() =>
            splitAt({ array: "no", index: Number.NEGATIVE_INFINITY }),
        ).toThrow(RangeError);
    });
});
