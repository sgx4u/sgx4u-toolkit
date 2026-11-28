import { describe, expect, it } from "vitest";
import { isEmptyArray } from "./is-empty-array.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("isEmptyArray", () => {
    it("returns true only for an array with length 0", () => {
        expect(isEmptyArray([])).toBe(true);
        expect(isEmptyArray([1])).toBe(false);
        expect(isEmptyArray([1, 2])).toBe(false);

        const hole: number[] = [];
        hole[0] = 1;
        delete hole[0];
        expect(isEmptyArray(hole)).toBe(false);
    });

    it("returns false for values that are not real arrays", () => {
        expect(isEmptyArray(null)).toBe(false);
        expect(isEmptyArray({})).toBe(false);
        expect(isEmptyArray({ length: 0 })).toBe(false);
        expect(isEmptyArray("text")).toBe(false);
        expect(isEmptyArray("")).toBe(false);
        expect(isEmptyArray(new Uint8Array([1]))).toBe(false);
        expect(isEmptyArray(new Uint8Array())).toBe(false);
        expect(isEmptyArray(new Set([1]))).toBe(false);
        expect(isEmptyArray(oneNumber())).toBe(false);
    });

    it("accepts an array subclass and does not mutate the input", () => {
        class Bag extends Array {}

        const empty = Object.freeze(new Bag());
        const filled = Object.freeze([1]);
        expect(isEmptyArray(empty)).toBe(true);
        expect(isEmptyArray(filled)).toBe(false);
    });
});
