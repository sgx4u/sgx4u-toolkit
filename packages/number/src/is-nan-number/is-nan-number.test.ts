import { describe, expect, it } from "vitest";
import { isNaNNumber } from "../index.js";

describe("isNaNNumber", () => {
    it("accepts only the number NaN", () => {
        expect(isNaNNumber(Number.NaN)).toBe(true);
        expect(isNaNNumber(0 / 0)).toBe(true);
    });

    it("rejects other values", () => {
        expect(isNaNNumber("NaN")).toBe(false);
        expect(isNaNNumber(undefined)).toBe(false);
        expect(isNaNNumber(1)).toBe(false);
        expect(isNaNNumber(Number.POSITIVE_INFINITY)).toBe(false);
    });
});
