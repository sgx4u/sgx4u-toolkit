import { describe, expect, it } from "vitest";
import { toJulianDate } from "../index.js";

describe("toJulianDate", () => {
    it("converts the Unix epoch to 2440587.5", () => {
        expect(toJulianDate(0)).toBe(2_440_587.5);
        expect(toJulianDate("1970-01-01T00:00:00Z")).toBe(2_440_587.5);
        expect(toJulianDate(new Date(0))).toBe(2_440_587.5);
        expect(toJulianDate(-0)).toBe(2_440_587.5);
    });

    it("scales milliseconds and keeps a negative instant", () => {
        expect(toJulianDate(-1_500)).toBe(2_440_587.5 - 1_500 / 86_400_000);
        expect(toJulianDate(86_400_000)).toBe(2_440_588.5);
        expect(toJulianDate("2000-01-01T12:00:00Z")).toBe(2_451_545);
        expect(toJulianDate("2024-02-29T00:00:00Z")).toBe(2_460_369.5);
        const yearZero = new Date(0);
        yearZero.setUTCFullYear(0, 0, 1);
        yearZero.setUTCHours(0, 0, 0, 0);
        expect(toJulianDate("0000-01-01T00:00:00Z")).toBe(
            yearZero.getTime() / 86_400_000 + 2_440_587.5,
        );
        expect(toJulianDate("9999-12-31T00:00:00Z")).toBe(
            Date.parse("9999-12-31T00:00:00Z") / 86_400_000 + 2_440_587.5,
        );
    });

    it("throws when the date is not real", () => {
        expect(toJulianDate("2024-02-30")).toBeUndefined();
        expect(toJulianDate(new Date(Number.NaN))).toBeUndefined();
        expect(toJulianDate(Number.POSITIVE_INFINITY)).toBeUndefined();
        expect(toJulianDate(null as unknown as number)).toBeUndefined();
    });
});
