import { describe, expect, it } from "vitest";
import { isPositive } from "../index.js";

describe("isPositive", () => {
    it("accepts numbers greater than zero", () => {
        expect(isPositive(0.1)).toBe(true);
        expect(isPositive(Number.POSITIVE_INFINITY)).toBe(true);
    });

    it("rejects zero and other values", () => {
        expect(isPositive(0)).toBe(false);
        expect(isPositive(-0)).toBe(false);
        expect(isPositive(Number.NaN)).toBe(false);
        expect(isPositive(-1)).toBe(false);
        expect(isPositive("1")).toBe(false);
    });
});
