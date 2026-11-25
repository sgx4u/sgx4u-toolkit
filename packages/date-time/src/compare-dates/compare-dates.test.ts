import { describe, expect, it } from "vitest";
import {
    addDuration,
    clampDate,
    compareDates,
    endOfUnit,
    findClosestDate,
    findClosestDateIndex,
    getEarliestDate,
    getLatestDate,
    getNextWeekday,
    getNthWeekdayOfMonth,
    getPreviousWeekday,
    isAfter,
    isBefore,
    isBetween,
    isSameInstant,
    isSameUnit,
    removeDuplicateDates,
    roundToUnit,
    setDateParts,
    sortDates,
    startOfUnit,
    subtractDuration,
} from "../index.js";

const original = new Date("2024-06-15T12:00:00.000Z");

describe("comparison and arithmetic", () => {
    it("orders instants and does not change the input", () => {
        const timeValue = original.getTime();

        expect(compareDates(original, "2024-06-15T12:00:00.000Z")).toBe(0);
        expect(compareDates("2024-06-15T11:00:00Z", original)).toBe(-1);
        expect(isBefore("2024-06-15T11:00:00Z", original)).toBe(true);
        expect(isAfter(original, "2024-06-15T11:00:00Z")).toBe(true);
        expect(isSameInstant(0, "1970-01-01T00:00:00.000Z")).toBe(true);
        expect(isSameInstant(original, "2024-06-15T12:00:01.000Z")).toBe(false);
        expect(original.getTime()).toBe(timeValue);
        expect(() => compareDates("nope", original)).toThrow(RangeError);
        expect(() => isBefore(true as unknown as string, original)).toThrow(
            TypeError,
        );
    });

    it("compares units in a zone, including a daylight-saving day", () => {
        expect(
            isSameUnit("2024-06-15T23:00:00Z", "2024-06-16T02:00:00Z", "day", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(true);
        expect(
            isSameUnit("2024-03-10T05:30:00Z", "2024-03-10T06:30:00Z", "day", {
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isSameUnit("2024-01-01T00:00:00Z", "2024-01-08T00:00:00Z", "week", {
                timeZone: "UTC",
            }),
        ).toBe(false);
    });

    it("checks a range, the extremes, a clamp, and a stable sort", () => {
        const dates = ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"];

        expect(
            isBetween(
                "2024-01-02T00:00:00Z",
                "2024-01-01T00:00:00Z",
                "2024-01-03T00:00:00Z",
            ),
        ).toBe(true);
        expect(
            isBetween(
                "2024-01-01T00:00:00Z",
                "2024-01-01T00:00:00Z",
                "2024-01-03T00:00:00Z",
                { includeStart: false },
            ),
        ).toBe(false);
        expect(getEarliestDate([])).toBeUndefined();
        expect(getEarliestDate(dates)?.toISOString()).toBe(
            "2024-01-01T00:00:00.000Z",
        );
        expect(getLatestDate(dates)?.toISOString()).toBe(
            "2024-01-02T00:00:00.000Z",
        );
        expect(dates[0]).toBe("2024-01-02T00:00:00Z");
        expect(
            clampDate("2024-01-10T00:00:00Z", {
                start: "2024-01-01T00:00:00Z",
                end: "2024-01-05T00:00:00Z",
            }).toISOString(),
        ).toBe("2024-01-05T00:00:00.000Z");
        expect(() =>
            clampDate("2024-01-03T00:00:00Z", {
                start: "2024-01-05T00:00:00Z",
                end: "2024-01-01T00:00:00Z",
            }),
        ).toThrow(RangeError);
        expect(
            sortDates(dates, { order: "descending" }).map((date) =>
                date.toISOString(),
            ),
        ).toEqual(["2024-01-02T00:00:00.000Z", "2024-01-01T00:00:00.000Z"]);
    });

    it("finds the earlier candidate on a tie and drops duplicate days", () => {
        const candidates = ["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"];

        expect(
            findClosestDate("2024-01-01T12:00:00Z", candidates)?.toISOString(),
        ).toBe("2024-01-01T00:00:00.000Z");
        expect(findClosestDateIndex("2024-01-01T12:00:00Z", [])).toBe(-1);
        expect(findClosestDateIndex("2024-01-01T12:00:00Z", candidates)).toBe(
            0,
        );
        expect(
            removeDuplicateDates(
                ["2024-06-15T01:00:00Z", "2024-06-15T20:00:00Z"],
                { unit: "day", timeZone: "UTC" },
            ),
        ).toHaveLength(1);
    });

    it("adds calendar units, keeps elapsed hours, and rounds", () => {
        expect(
            addDuration(
                "2026-01-31T00:00:00Z",
                { months: 1 },
                { timeZone: "UTC" },
            ).toISOString(),
        ).toBe("2026-02-28T00:00:00.000Z");
        expect(
            addDuration(
                "2024-03-09T14:00:00Z",
                { days: 1 },
                { timeZone: "America/New_York" },
            ).toISOString(),
        ).toBe("2024-03-10T13:00:00.000Z");
        expect(
            addDuration(
                "2024-03-09T14:00:00Z",
                { hours: 24 },
                { timeZone: "America/New_York" },
            ).toISOString(),
        ).toBe("2024-03-10T14:00:00.000Z");
        expect(
            subtractDuration(
                "2026-03-31T00:00:00Z",
                { months: 1 },
                { timeZone: "UTC" },
            ).toISOString(),
        ).toBe("2026-02-28T00:00:00.000Z");
        expect(() =>
            addDuration(
                "2026-01-31T00:00:00Z",
                { months: 1 },
                { timeZone: "UTC", overflow: "reject" },
            ),
        ).toThrow(RangeError);
        expect(
            setDateParts(
                "2026-01-15T00:00:00Z",
                { day: 31 },
                { timeZone: "UTC" },
            ).toISOString(),
        ).toBe("2026-01-31T00:00:00.000Z");
        expect(
            startOfUnit("2026-11-26T15:45:00Z", "day", {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            endOfUnit("2026-11-26T15:45:00Z", "day", {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-11-26T23:59:59.999Z");
        expect(
            startOfUnit("2024-09-08T12:00:00Z", "day", {
                timeZone: "America/Santiago",
            }).toISOString(),
        ).toBe("2024-09-08T04:00:00.000Z");
        expect(
            roundToUnit("2024-06-15T10:07:30Z", "minute", {
                timeZone: "UTC",
                increment: 15,
            }).toISOString(),
        ).toBe("2024-06-15T10:15:00.000Z");
        expect(() =>
            roundToUnit("2024-06-15T10:00:00Z", "minute", {
                timeZone: "UTC",
                increment: 7,
            }),
        ).toThrow(RangeError);
    });

    it("steps to weekdays and finds the nth weekday of a month", () => {
        expect(
            getNextWeekday("2026-11-26T15:00:00Z", 1, {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-11-30T00:00:00.000Z");
        expect(
            getPreviousWeekday("2026-11-26T15:00:00Z", 1, {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-11-23T00:00:00.000Z");
        expect(
            getNthWeekdayOfMonth(2026, 11, 4, 4, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            getNthWeekdayOfMonth(2026, 2, 1, 5, { timeZone: "UTC" }),
        ).toBeUndefined();
        expect(() => getNthWeekdayOfMonth(2026, 11, 1, 0)).toThrow(RangeError);
    });
});
