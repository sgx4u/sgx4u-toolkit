import { describe, expect, it } from "vitest";
import { differenceInBusinessDays } from "../index.js";

describe("differenceInBusinessDays", () => {
    it("counts weekdays in a half-open range and skips the default weekend", () => {
        expect(
            differenceInBusinessDays({
                later: "2026-11-30T00:00:00Z",
                earlier: "2026-11-27T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInBusinessDays({
                later: "2026-11-30T00:00:00Z",
                earlier: "2026-11-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(0);
        expect(
            differenceInBusinessDays({
                later: "2026-11-27T00:00:00Z",
                earlier: "2026-11-30T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(-1);
    });

    it("includes a Thursday leap day and the last weekday of the year", () => {
        expect(
            differenceInBusinessDays({
                later: "2024-03-01T00:00:00Z",
                earlier: "2024-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(2);
        expect(
            differenceInBusinessDays({
                later: "2025-01-01T00:00:00Z",
                earlier: "2024-12-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInBusinessDays({
                later: "2025-01-02T00:00:00Z",
                earlier: "2024-12-31T00:00:00Z",
                timeZone: "UTC",
                holidays: ["2024-12-31"],
            }),
        ).toBe(1);
    });

    it("counts Eastern calendar days across the spring-forward weekend", () => {
        expect(
            differenceInBusinessDays({
                later: "2024-03-11T04:30:00Z",
                earlier: "2024-03-08T04:30:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(2);
    });

    it("throws when the calendar has no business day and returns undefined for a bad date", () => {
        expect(() =>
            differenceInBusinessDays({
                later: "2031-01-01T00:00:00Z",
                earlier: "2020-01-01T00:00:00Z",
                timeZone: "UTC",
                workingDays: [],
            }),
        ).toThrow(RangeError);
        expect(
            differenceInBusinessDays({
                later: "nope",
                earlier: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
