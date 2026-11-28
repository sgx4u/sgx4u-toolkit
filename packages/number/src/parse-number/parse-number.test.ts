import { describe, expect, it } from "vitest";
import { parseNumber } from "../index.js";

describe("parseNumber", () => {
    it("covers the documented behavior", () => {
        expect(parseNumber(1.5)).toBe(1.5);
        expect(parseNumber("  -2.5 ")).toBe(-2.5);
        expect(parseNumber("1e-3")).toBe(0.001);
        expect(parseNumber(".5")).toBe(0.5);
        expect(parseNumber("+4")).toBe(4);
        expect(Object.is(parseNumber("-0"), -0)).toBe(true);
        expect(parseNumber("")).toBeUndefined();
        expect(parseNumber("  ")).toBeUndefined();
        expect(parseNumber("1,000")).toBeUndefined();
        expect(parseNumber("NaN")).toBeUndefined();
        expect(parseNumber("Infinity")).toBeUndefined();
        expect(parseNumber(true)).toBeUndefined();
        expect(parseNumber(null)).toBeUndefined();
        expect(parseNumber(Number.NaN)).toBeUndefined();
        expect(parseNumber("1e999")).toBeUndefined();
    });
});
