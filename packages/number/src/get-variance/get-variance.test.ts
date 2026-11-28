import { describe, expect, it } from "vitest";
import { getVariance } from "../index.js";

describe("getVariance", () => {
    it("covers the documented behavior", () => {
        expect(getVariance({ values: [1, 2, 3], sample: false })).toBeCloseTo(
            2 / 3,
        );
        expect(getVariance({ values: [1] })).toBeUndefined();
        expect(getVariance({ values: [2], sample: false })).toBe(0);
        expect(getVariance({ values: [] })).toBeUndefined();
    });
});
