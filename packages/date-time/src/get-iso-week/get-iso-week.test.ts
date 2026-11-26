import { describe, expect, it } from "vitest";
import { getIsoWeek } from "../index.js";

describe("getIsoWeek", () => {
    it("numbers 2026-01-01 as week 1 and keeps a late December date in that week", () => {
        expect(getIsoWeek("2026-01-01T00:00:00Z", { timeZone: "UTC" })).toBe(1);
        expect(getIsoWeek("2025-12-29T00:00:00Z", { timeZone: "UTC" })).toBe(1);
        expect(getIsoWeek("2021-01-01T00:00:00Z", { timeZone: "UTC" })).toBe(
            53,
        );
        expect(getIsoWeek("2020-12-31T00:00:00Z", { timeZone: "UTC" })).toBe(
            53,
        );
    });

    it("changes week at local midnight in New York and Kolkata", () => {
        expect(
            getIsoWeek("2024-12-30T04:59:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(52);
        expect(
            getIsoWeek("2024-12-30T05:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(1);
        expect(
            getIsoWeek("2024-12-29T18:29:00Z", { timeZone: "Asia/Kolkata" }),
        ).toBe(52);
        expect(
            getIsoWeek("2024-12-29T18:30:00Z", { timeZone: "Asia/Kolkata" }),
        ).toBe(1);
    });

    it("reads a date-only string in the default zone", () => {
        expect(getIsoWeek("2026-01-01")).toBe(1);
    });

    it("throws when the date is not real", () => {
        expect(() => getIsoWeek("nope")).toThrow(RangeError);
        expect(() => getIsoWeek("nope")).toThrow(
            '`date` must be a valid date; received "nope".',
        );
        expect(() => getIsoWeek(new Date(Number.NaN))).toThrow("Invalid Date");
    });
});
