import { describe, expect, it } from "vitest";
import { getDaysInMonth } from "../index.js";

describe("getDaysInMonth", () => {
    it("returns 28 through 31, with February 29 in a leap year", () => {
        expect(getDaysInMonth(2024, 1)).toBe(31);
        expect(getDaysInMonth(2024, 2)).toBe(29);
        expect(getDaysInMonth(2023, 2)).toBe(28);
        expect(getDaysInMonth(1900, 2)).toBe(28);
        expect(getDaysInMonth(2000, 2)).toBe(29);
        expect(getDaysInMonth(2024, 4)).toBe(30);
        expect(getDaysInMonth(2024, 12)).toBe(31);
    });

    it("throws when the month is outside 1 through 12", () => {
        expect(() => getDaysInMonth(2024, 0)).toThrow(RangeError);
        expect(() => getDaysInMonth(2024, 13)).toThrow(
            "`month` must be an integer from 1 to 12; received 13.",
        );
        expect(() => getDaysInMonth(2024, 1.5)).toThrow(RangeError);
        expect(() => getDaysInMonth("2024" as unknown as number, 1)).toThrow(
            TypeError,
        );
    });
});
