import { describe, expect, it } from "vitest";
import { isNegative } from "../index.js";

describe("isNegative", () => {
    it("accepts numbers less than zero", () => {
        expect(isNegative(-0.1)).toBe(true);
        expect(isNegative(Number.NEGATIVE_INFINITY)).toBe(true);
    });

    it("rejects zero and other values", () => {
        expect(isNegative(0)).toBe(false);
        expect(isNegative(-0)).toBe(false);
        expect(isNegative(Number.NaN)).toBe(false);
        expect(isNegative(1)).toBe(false);
    });
});
