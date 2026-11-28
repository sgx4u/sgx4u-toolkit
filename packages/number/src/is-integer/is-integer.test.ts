import { describe, expect, it } from "vitest";
import { isInteger } from "../index.js";

describe("isInteger", () => {
    it("accepts integers", () => {
        expect(isInteger(0)).toBe(true);
        expect(isInteger(-3)).toBe(true);
        expect(isInteger(1.0)).toBe(true);
    });

    it("rejects fractions and other types", () => {
        expect(isInteger(1.5)).toBe(false);
        expect(isInteger(Number.NaN)).toBe(false);
        expect(isInteger("1")).toBe(false);
    });
});
