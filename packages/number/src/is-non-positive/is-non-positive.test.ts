import { describe, expect, it } from "vitest";
import { isNonPositive } from "../index.js";

describe("isNonPositive", () => {
    it("accepts zero and negative numbers", () => {
        expect(isNonPositive(0)).toBe(true);
        expect(isNonPositive(-0)).toBe(true);
        expect(isNonPositive(Number.NEGATIVE_INFINITY)).toBe(true);
    });

    it("rejects positive numbers and non-numbers", () => {
        expect(isNonPositive(1)).toBe(false);
        expect(isNonPositive(Number.NaN)).toBe(false);
        expect(isNonPositive(false)).toBe(false);
    });
});
