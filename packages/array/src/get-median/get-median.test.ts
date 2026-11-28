import { describe, expect, it } from "vitest";
import { getMedian } from "./get-median.js";

describe("getMedian", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getMedian({ array: [] })).toBeUndefined();
        expect(getMedian(undefined as never)).toBeUndefined();
    });

    it("returns the middle number, or the mean of the two central numbers", () => {
        const values = Object.freeze([3, 1, 2]);
        expect(getMedian({ array: values })).toBe(2);
        expect(getMedian({ array: [1, 2, 3, 4] })).toBe(2.5);
        expect(getMedian({ array: [{ n: 4 }, { n: 1 }], by: "n" })).toBe(2.5);
        expect(values).toEqual([3, 1, 2]);
    });

    it("throws when an item is not a finite number", () => {
        expect(() => getMedian({ array: [1, "2"] })).toThrow(TypeError);
    });
});
