import { describe, expect, it } from "vitest";
import { differenceInCalendarUnit } from "../index.js";

describe("differenceInCalendarUnit", () => {
    it("counts a year crossed at midnight on New Year's Day", () => {
        expect(
            differenceInCalendarUnit({
                later: "2027-01-01T00:00:00Z",
                earlier: "2026-12-31T00:00:00Z",
                unit: "year",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInCalendarUnit({
                later: "2026-04-01T00:00:00Z",
                earlier: "2026-03-31T00:00:00Z",
                unit: "quarter",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInCalendarUnit({
                later: "2026-02-01T00:00:00Z",
                earlier: "2026-01-31T00:00:00Z",
                unit: "month",
                timeZone: "UTC",
            }),
        ).toBe(1);
    });

    it("counts the leap day in 2024 and starts weeks on Monday by default", () => {
        expect(
            differenceInCalendarUnit({
                later: "2024-03-01T00:00:00Z",
                earlier: "2024-02-28T00:00:00Z",
                unit: "day",
                timeZone: "UTC",
            }),
        ).toBe(2);
        expect(
            differenceInCalendarUnit({
                later: "2023-03-01T00:00:00Z",
                earlier: "2023-02-28T00:00:00Z",
                unit: "day",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInCalendarUnit({
                later: "2026-01-04T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "week",
                timeZone: "UTC",
            }),
        ).toBe(0);
        expect(
            differenceInCalendarUnit({
                later: "2026-01-04T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "week",
                timeZone: "UTC",
                weekStartsOn: 1,
            }),
        ).toBe(0);
        expect(
            differenceInCalendarUnit({
                later: "2026-01-04T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "week",
                timeZone: "UTC",
                weekStartsOn: 7,
            }),
        ).toBe(1);
    });

    it("counts one Eastern calendar day across the spring-forward change", () => {
        expect(
            differenceInCalendarUnit({
                later: "2024-03-11T04:00:00Z",
                earlier: "2024-03-10T05:00:00Z",
                unit: "day",
                timeZone: "America/New_York",
            }),
        ).toBe(1);
        expect(
            differenceInCalendarUnit({
                later: "2024-03-10T07:30:00Z",
                earlier: "2024-03-10T06:30:00Z",
                unit: "day",
                timeZone: "America/New_York",
            }),
        ).toBe(0);
    });

    it("rejects a clock unit and a unit that is not a string", () => {
        expect(() =>
            differenceInCalendarUnit({
                later: "2026-01-02T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour" as "day",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            differenceInCalendarUnit({
                later: "2026-01-02T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour" as "day",
                timeZone: "UTC",
            }),
        ).toThrow('`unit` must be a calendar unit; received "hour".');
        expect(() =>
            differenceInCalendarUnit({
                later: "2026-01-02T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: 1 as unknown as "day",
                timeZone: "UTC",
            }),
        ).toThrow(TypeError);
    });
});
