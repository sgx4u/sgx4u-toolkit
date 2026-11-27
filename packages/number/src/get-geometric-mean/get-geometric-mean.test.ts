import { describe, expect, it } from "vitest";
import { getGeometricMean } from "../index.js";

describe("getGeometricMean", () => {
    it("covers the documented behavior", () => {
        expect(getGeometricMean([1, 4])).toBe(2);
        expect(getGeometricMean([])).toBeUndefined();
        expect(getGeometricMean([1, 0])).toBeUndefined();
        expect(getGeometricMean([1, -2])).toBeUndefined();
    });
});
