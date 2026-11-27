import { describe, expect, it } from "vitest";
import { compactNullish } from "./compact-nullish.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("compactNullish", () => {
    it("removes only null and undefined", () => {
        const input = Object.freeze([
            0,
            false,
            "",
            null,
            undefined,
            1,
            Number.NaN,
        ]);
        const result = compactNullish(input);

        expect(result).toEqual([0, false, "", 1, Number.NaN]);
        expect(result).not.toBe(input);
        expect(compactNullish([])).toEqual([]);
        expect(compactNullish([null])).toEqual([]);
        expect(compactNullish([0])).toEqual([0]);
        expect(input).toEqual([0, false, "", null, undefined, 1, Number.NaN]);
    });

    it("removes a hole", () => {
        const sparse: Array<number | null> = [];
        sparse[0] = 0;
        sparse[2] = null;
        sparse[3] = 1;
        expect(compactNullish(sparse)).toEqual([0, 1]);
    });

    it("returns undefined for invalid input", () => {
        expect(compactNullish(null)).toBeUndefined();
        expect(compactNullish({})).toBeUndefined();
        expect(compactNullish("text")).toBeUndefined();
        expect(compactNullish(new Uint8Array([1]))).toBeUndefined();
        expect(compactNullish(new Set([1]))).toBeUndefined();
        expect(compactNullish(oneNumber())).toBeUndefined();
    });
});
