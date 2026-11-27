import { describe, expect, it } from "vitest";
import { getGreatestCommonDivisor } from "../index.js";

describe("getGreatestCommonDivisor", () => {
    it("covers the documented behavior", () => {
        expect(getGreatestCommonDivisor({ values: [12, 18, 30] })).toBe(6);
        expect(getGreatestCommonDivisor({ values: [-8, 12] })).toBe(4);
        expect(getGreatestCommonDivisor({ values: [4] })).toBeUndefined();
        expect(getGreatestCommonDivisor({ values: [1.5, 3] })).toBeUndefined();
    });
});
