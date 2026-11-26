import { describe, expect, it } from "vitest";
import { differenceInCalendarUnit } from "../index.js";

describe("differenceInCalendarUnit", () => {
    it("counts a year crossed at midnight on New Year's Day", () => {
        expect(
            differenceInCalendarUnit(
                "2027-01-01T00:00:00Z",
                "2026-12-31T00:00:00Z",
                "year",
                { timeZone: "UTC" },
            ),
        ).toBe(1);
        expect(
            differenceInCalendarUnit(
                "2026-04-01T00:00:00Z",
                "2026-03-31T00:00:00Z",
                "quarter",
                { timeZone: "UTC" },
            ),
        ).toBe(1);
        expect(
            differenceInCalendarUnit(
                "2026-02-01T00:00:00Z",
                "2026-01-31T00:00:00Z",
                "month",
                { timeZone: "UTC" },
            ),
        ).toBe(1);
    });

    it("counts the leap day in 2024 and starts weeks on Monday by default", () => {
        expect(
            differenceInCalendarUnit(
                "2024-03-01T00:00:00Z",
                "2024-02-28T00:00:00Z",
                "day",
                { timeZone: "UTC" },
            ),
        ).toBe(2);
        expect(
            differenceInCalendarUnit(
                "2023-03-01T00:00:00Z",
                "2023-02-28T00:00:00Z",
                "day",
                { timeZone: "UTC" },
            ),
        ).toBe(1);
        expect(
            differenceInCalendarUnit(
                "2026-01-04T00:00:00Z",
                "2026-01-01T00:00:00Z",
                "week",
                { timeZone: "UTC" },
            ),
        ).toBe(0);
        expect(
            differenceInCalendarUnit(
                "2026-01-04T00:00:00Z",
                "2026-01-01T00:00:00Z",
                "week",
                { timeZone: "UTC", weekStartsOn: 1 },
            ),
        ).toBe(0);
        expect(
            differenceInCalendarUnit(
                "2026-01-04T00:00:00Z",
                "2026-01-01T00:00:00Z",
                "week",
                { timeZone: "UTC", weekStartsOn: 7 },
            ),
        ).toBe(1);
    });

    it("counts one Eastern calendar day across the spring-forward change", () => {
        expect(
            differenceInCalendarUnit(
                "2024-03-11T04:00:00Z",
                "2024-03-10T05:00:00Z",
                "day",
                { timeZone: "America/New_York" },
            ),
        ).toBe(1);
        expect(
            differenceInCalendarUnit(
                "2024-03-10T07:30:00Z",
                "2024-03-10T06:30:00Z",
                "day",
                { timeZone: "America/New_York" },
            ),
        ).toBe(0);
    });

    it("rejects a clock unit and a unit that is not a string", () => {
        expect(() =>
            differenceInCalendarUnit(
                "2026-01-02T00:00:00Z",
                "2026-01-01T00:00:00Z",
                "hour" as "day",
                { timeZone: "UTC" },
            ),
        ).toThrow(RangeError);
        expect(() =>
            differenceInCalendarUnit(
                "2026-01-02T00:00:00Z",
                "2026-01-01T00:00:00Z",
                "hour" as "day",
                { timeZone: "UTC" },
            ),
        ).toThrow('`unit` must be a calendar unit; received "hour".');
        expect(() =>
            differenceInCalendarUnit(
                "2026-01-02T00:00:00Z",
                "2026-01-01T00:00:00Z",
                1 as unknown as "day",
                { timeZone: "UTC" },
            ),
        ).toThrow(TypeError);
    });
});
