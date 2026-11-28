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

    it("returns false for a value that is not a finite integer", () => {
        expect(isLeapYear(2024.5)).toBe(false);
        expect(isLeapYear(Number.NaN)).toBe(false);
        expect(isLeapYear(Number.POSITIVE_INFINITY)).toBe(false);
        expect(isLeapYear("2024" as unknown as number)).toBe(false);
    });
});
