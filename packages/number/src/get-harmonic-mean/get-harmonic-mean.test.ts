import { describe, expect, it } from "vitest";
import { getHarmonicMean } from "../index.js";

describe("getHarmonicMean", () => {
    it("covers the documented behavior", () => {
        expect(getHarmonicMean([1, 2])).toBeCloseTo(4 / 3);
        expect(getHarmonicMean([])).toBeUndefined();
        expect(getHarmonicMean([1, 0])).toBeUndefined();
        expect(getHarmonicMean([1, -1])).toBeUndefined();
    });
});
