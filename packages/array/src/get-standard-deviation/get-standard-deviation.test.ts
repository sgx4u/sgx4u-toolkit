import { describe, expect, it } from "vitest";
import { getStandardDeviation } from "./get-standard-deviation.js";

describe("getStandardDeviation", () => {
    it("returns undefined when the variance is undefined", () => {
        expect(getStandardDeviation({ array: [] })).toBeUndefined();
        expect(
            getStandardDeviation({ array: [1], sample: true }),
        ).toBeUndefined();
        expect(getStandardDeviation(null as never)).toBeUndefined();
    });

    it("returns the square root of the variance", () => {
        const values = Object.freeze([1, 2, 3]);
        expect(getStandardDeviation({ array: values })).toBeCloseTo(
            Math.sqrt(2 / 3),
        );
        expect(getStandardDeviation({ array: values, sample: true })).toBe(1);
        expect(getStandardDeviation({ array: [4] })).toBe(0);
        expect(values).toEqual([1, 2, 3]);
    });
});
