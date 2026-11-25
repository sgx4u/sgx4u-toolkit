import { describe, expect, it } from "vitest";
import { isLeapYear } from "../index.js";

describe("isLeapYear", () => {
    it("follows the Gregorian rule, including century years and year 0", () => {
        expect(isLeapYear(2024)).toBe(true);
        expect(isLeapYear(2023)).toBe(false);
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(1900)).toBe(false);
        expect(isLeapYear(0)).toBe(true);
        expect(isLeapYear(-400)).toBe(true);
        expect(isLeapYear(-100)).toBe(false);
    });

    it("throws for a non-integer", () => {
        expect(() => isLeapYear(2024.5)).toThrow(RangeError);
        expect(() => isLeapYear(Number.NaN)).toThrow(RangeError);
        expect(() => isLeapYear("2024" as unknown as number)).toThrow(
            TypeError,
        );
    });
});
