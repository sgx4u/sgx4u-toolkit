import { describe, expect, it } from "vitest";
import { getAt } from "./get-at.js";
import type { GetAtParams } from "./get-at.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getAt", () => {
    it("returns the item at a positive or negative index", () => {
        const item = { value: 1 };
        const params: GetAtParams<typeof item> = {
            array: [item],
            index: 0,
        };
        expect(getAt({ array: [1, 2, 3], index: 0 })).toBe(1);
        expect(getAt({ array: [1, 2, 3], index: 1 })).toBe(2);
        expect(getAt({ array: [1], index: 0 })).toBe(1);
        expect(getAt({ array: [1, 2, 3], index: -1 })).toBe(3);
        expect(getAt({ array: [1, 2, 3], index: -3 })).toBe(1);
        expect(getAt(params)).toBe(item);
    });

    it("returns undefined for an unusable index or a hole", () => {
        expect(getAt({ array: [1, 2, 3], index: 3 })).toBeUndefined();
        expect(getAt({ array: [1, 2, 3], index: -4 })).toBeUndefined();
        expect(getAt({ array: [1, 2, 3], index: 1.5 })).toBeUndefined();
        expect(getAt({ array: [], index: 0 })).toBeUndefined();

        const sparse: number[] = [];
        sparse.length = 1;
        expect(getAt({ array: sparse, index: 0 })).toBeUndefined();
    });

    it("returns undefined for invalid input", () => {
        expect(getAt(null)).toBeUndefined();
        expect(getAt({})).toBeUndefined();
        expect(getAt("text")).toBeUndefined();
        expect(getAt(new Uint8Array([1]))).toBeUndefined();
        expect(getAt(new Set([1]))).toBeUndefined();
        expect(getAt(oneNumber())).toBeUndefined();
        expect(getAt({ array: "text", index: 0 })).toBeUndefined();
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2, 3]);
        expect(getAt({ array: input, index: -1 })).toBe(3);
        expect(input).toEqual([1, 2, 3]);
    });
});
