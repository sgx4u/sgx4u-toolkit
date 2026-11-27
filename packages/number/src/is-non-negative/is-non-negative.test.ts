import { describe, expect, it } from "vitest";
import { isNonNegative } from "../index.js";

describe("isNonNegative", () => {
    it("accepts zero and positive numbers", () => {
        expect(isNonNegative(0)).toBe(true);
        expect(isNonNegative(-0)).toBe(true);
        expect(isNonNegative(Number.POSITIVE_INFINITY)).toBe(true);
    });

    it("rejects negative numbers and non-numbers", () => {
        expect(isNonNegative(-1)).toBe(false);
        expect(isNonNegative(Number.NaN)).toBe(false);
        expect(isNonNegative("0")).toBe(false);
    });
});
