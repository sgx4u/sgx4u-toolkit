import { describe, expect, it } from "vitest";
import { hasAtLeast } from "./has-at-least.js";
import type { HasAtLeastParams } from "./has-at-least.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("hasAtLeast", () => {
    it("compares the array length with a finite count", () => {
        const params: HasAtLeastParams = { array: [1, 2, 3], count: 2 };
        expect(hasAtLeast(params)).toBe(true);
        expect(hasAtLeast({ array: [1], count: 1 })).toBe(true);
        expect(hasAtLeast({ array: [], count: 0 })).toBe(true);
        expect(hasAtLeast({ array: [], count: -1 })).toBe(true);
        expect(hasAtLeast({ array: [1, 2], count: 1.5 })).toBe(true);
        expect(hasAtLeast({ array: [1], count: 1.5 })).toBe(false);
        expect(hasAtLeast({ array: [], count: 1 })).toBe(false);
        expect(hasAtLeast({ array: [1], count: 2 })).toBe(false);
    });

    it("returns false when count is not a finite number", () => {
        expect(hasAtLeast({ array: [1, 2], count: Number.NaN })).toBe(false);
        expect(
            hasAtLeast({ array: [1, 2], count: Number.POSITIVE_INFINITY }),
        ).toBe(false);
        expect(hasAtLeast({ array: [1, 2], count: "2" })).toBe(false);
        expect(hasAtLeast({ array: [1, 2] })).toBe(false);
    });

    it("returns false for invalid input and does not throw", () => {
        expect(hasAtLeast(null)).toBe(false);
        expect(hasAtLeast({})).toBe(false);
        expect(hasAtLeast("text")).toBe(false);
        expect(hasAtLeast(new Uint8Array([1]))).toBe(false);
        expect(hasAtLeast(new Set([1]))).toBe(false);
        expect(hasAtLeast(oneNumber())).toBe(false);
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2]);
        expect(hasAtLeast({ array: input, count: 2 })).toBe(true);
        expect(input).toEqual([1, 2]);
    });
});
