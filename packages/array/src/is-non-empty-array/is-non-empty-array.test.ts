import { describe, expect, it } from "vitest";
import { isNonEmptyArray } from "./is-non-empty-array.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("isNonEmptyArray", () => {
    it("returns true for an array with at least one item", () => {
        expect(isNonEmptyArray([1])).toBe(true);
        expect(isNonEmptyArray([1, 2])).toBe(true);
        expect(isNonEmptyArray([])).toBe(false);

        const hole: number[] = [];
        hole.length = 1;
        expect(isNonEmptyArray(hole)).toBe(true);
    });

    it("narrows an unknown value to a non-empty array", () => {
        const value: unknown = ["first"];
        if (!isNonEmptyArray(value)) {
            throw new Error("expected a non-empty array");
        }
        expect(value[0]).toBe("first");
    });

    it("returns false for values that are not real arrays", () => {
        expect(isNonEmptyArray(null)).toBe(false);
        expect(isNonEmptyArray({})).toBe(false);
        expect(isNonEmptyArray("text")).toBe(false);
        expect(isNonEmptyArray(new Uint8Array([1]))).toBe(false);
        expect(isNonEmptyArray(new Set([1]))).toBe(false);
        expect(isNonEmptyArray(oneNumber())).toBe(false);
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1]);
        expect(isNonEmptyArray(input)).toBe(true);
        expect(input).toEqual([1]);
    });
});
