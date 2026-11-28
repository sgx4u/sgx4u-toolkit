import { describe, expect, it } from "vitest";
import { getVariance } from "./get-variance.js";

describe("getVariance", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getVariance({ array: [] })).toBeUndefined();
        expect(getVariance(undefined as never)).toBeUndefined();
    });

    it("uses the population variance unless sample is true", () => {
        const values = Object.freeze([1, 2, 3]);
        expect(getVariance({ array: values })).toBeCloseTo(2 / 3);
        expect(getVariance({ array: values, sample: true })).toBe(1);
        expect(getVariance({ array: [5] })).toBe(0);
        expect(getVariance({ array: [5], sample: true })).toBeUndefined();
        expect(values).toEqual([1, 2, 3]);
    });

    it("throws when sample is not a boolean or an item is not numeric", () => {
        expect(() =>
            getVariance({ array: [1], sample: "yes" as never }),
        ).toThrow(TypeError);
        expect(() => getVariance({ array: [1, "2"] })).toThrow(TypeError);
    });
});
