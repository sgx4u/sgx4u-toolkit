import { describe, expect, it } from "vitest";
import { getDaysInYear } from "../index.js";

describe("getDaysInYear", () => {
    it("returns 366 only in a Gregorian leap year", () => {
        expect(getDaysInYear(2024)).toBe(366);
        expect(getDaysInYear(2023)).toBe(365);
        expect(getDaysInYear(1900)).toBe(365);
        expect(getDaysInYear(2000)).toBe(366);
        expect(getDaysInYear(0)).toBe(366);
    });

    it("returns undefined when the year is not an integer", () => {
        expect(getDaysInYear(2024.5)).toBeUndefined();
        expect(getDaysInYear(true as unknown as number)).toBeUndefined();
    });
});