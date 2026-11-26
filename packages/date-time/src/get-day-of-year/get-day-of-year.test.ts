import { describe, expect, it } from "vitest";
import { getDayOfYear } from "../index.js";

describe("getDayOfYear", () => {
    it("numbers a leap day and the last day of a common year", () => {
        expect(getDayOfYear("2024-02-29T00:00:00Z", { timeZone: "UTC" })).toBe(
            60,
        );
        expect(getDayOfYear("2024-03-01T00:00:00Z", { timeZone: "UTC" })).toBe(
            61,
        );
        expect(getDayOfYear("2024-12-31T00:00:00Z", { timeZone: "UTC" })).toBe(
            366,
        );
        expect(getDayOfYear("2023-12-31T00:00:00Z", { timeZone: "UTC" })).toBe(
            365,
        );
        expect(getDayOfYear("2024-01-01T00:00:00Z", { timeZone: "UTC" })).toBe(
            1,
        );
    });

    it("reads the wall-clock date across a zone offset", () => {
        expect(
            getDayOfYear("2024-03-01T04:30:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(60);
        expect(
            getDayOfYear("2024-03-01T05:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(61);
        expect(
            getDayOfYear("2024-02-29T18:29:00Z", { timeZone: "Asia/Kolkata" }),
        ).toBe(60);
        expect(
            getDayOfYear("2024-02-29T18:30:00Z", { timeZone: "Asia/Kolkata" }),
        ).toBe(61);
    });

    it("treats a date-only string as midnight in the default zone", () => {
        expect(getDayOfYear("2024-02-29")).toBe(60);
        expect(getDayOfYear("2024-12-31")).toBe(366);
    });

    it("throws when the date is not real", () => {
        expect(() => getDayOfYear("nope")).toThrow(RangeError);
        expect(() => getDayOfYear("nope")).toThrow(
            '`date` must be a valid date; received "nope".',
        );
        expect(() => getDayOfYear(new Date(Number.NaN))).toThrow(
            "Invalid Date",
        );
    });
});
