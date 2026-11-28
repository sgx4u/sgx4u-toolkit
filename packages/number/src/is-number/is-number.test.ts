import { describe, expect, it } from "vitest";
import { isNumber } from "../index.js";

describe("isNumber", () => {
    it("accepts every number", () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-0)).toBe(true);
        expect(isNumber(Number.NaN)).toBe(true);
        expect(isNumber(Number.POSITIVE_INFINITY)).toBe(true);
    });

    it("rejects other types", () => {
        expect(isNumber("1")).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber(1n)).toBe(false);
        expect(isNumber(true)).toBe(false);
    });
});
