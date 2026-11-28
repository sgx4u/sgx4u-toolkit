import { describe, expect, it } from "vitest";
import {
    createMonthCalendarGrid,
    differenceAsDuration,
    differenceInCalendarUnit,
    differenceInUnit,
    getAge,
    getAgeAsDuration,
    getCountdownParts,
    getDayOfYear,
    getFiscalQuarter,
    getFiscalYear,
    getFiscalYearInterval,
    getISOWeek,
    getISOWeekYear,
    getISOWeeksInYear,
    getLocaleWeekInfo,
    getMillisecondsUntilNextUnit,
    getNextAnniversary,
    getQuarter,
    getWeekOfMonth,
    getWeekOfYear,
    isFuture,
    isPast,
    isToday,
    isTomorrow,
    isWeekend,
    isWithinLast,
    isWithinNext,
    isYesterday,
} from "../index.js";
import { addDuration } from "../index.js";

describe("ages, now, and calendars", () => {
    it("counts units, calendar boundaries, and a duration that adds back", () => {
        expect(
            differenceInUnit({
                later: "2026-03-01T00:00:00Z",
                earlier: "2026-01-31T00:00:00Z",
                unit: "month",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInCalendarUnit({
                later: "2027-01-01T00:00:00Z",
                earlier: "2026-12-31T00:00:00Z",
                unit: "year",
                timeZone: "UTC",
            }),
        ).toBe(1);
        const duration = differenceAsDuration({
            later: "2026-01-01T01:00:00Z",
            earlier: "2026-01-01T00:00:00Z",
            timeZone: "UTC",
        });
        expect(duration).toEqual({ hours: 1 });
        expect(duration).toBeDefined();
        expect(
            addDuration({
                date: "2026-01-01T00:00:00Z",
                duration: duration!,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-01-01T01:00:00.000Z");
    });

    it("counts a leap-day birthday and the next anniversary", () => {
        expect(
            getAge({
                birthDate: "2000-02-29",
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(21);
        expect(
            getAge({
                birthDate: "2000-02-29",
                now: "2021-02-28T00:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "february-28",
            }),
        ).toBe(21);
        expect(
            getAge({
                birthDate: "2026-01-02T00:00:00Z",
                now: "2026-01-01T00:00:00Z",
            }),
        ).toBeUndefined();
        expect(
            getAgeAsDuration({
                birthDate: "2020-01-31",
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ years: 1, months: 1, days: 1 });
        expect(
            getNextAnniversary({
                date: "2000-02-29",
                now: "2021-03-01T12:00:00Z",
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2021-03-01T00:00:00.000Z");
        expect(
            getCountdownParts({
                target: "2026-01-01T01:00:00Z",
                now: "2026-01-01T00:00:00Z",
                largestUnit: "hour",
            })?.hours,
        ).toBe(1);
        expect(
            getCountdownParts({
                target: "2020-01-01T00:00:00Z",
                now: "2026-01-01T00:00:00Z",
            })?.isComplete,
        ).toBe(true);
    });

    it("answers questions about a supplied now", () => {
        const now = "2026-11-26T12:00:00Z";
        const zone = { timeZone: "UTC" as const, now };
        expect(isToday({ date: "2026-11-26T01:00:00Z", ...zone })).toBe(true);
        expect(isTomorrow({ date: "2026-11-27T00:00:00Z", ...zone })).toBe(
            true,
        );
        expect(isYesterday({ date: "2026-11-25T00:00:00Z", ...zone })).toBe(
            true,
        );
        expect(isPast({ date: "2020-01-01T00:00:00Z", now })).toBe(true);
        expect(isFuture({ date: "2027-01-01T00:00:00Z", now })).toBe(true);
        expect(isPast({ date: now, now })).toBe(false);
        expect(isWeekend({ date: "2026-11-28T00:00:00Z", ...zone })).toBe(true);
        expect(isWeekend({ date: "2026-11-26T00:00:00Z", ...zone })).toBe(
            false,
        );
        expect(
            isWithinNext({
                date: "2026-11-26T18:00:00Z",
                duration: { hours: 12 },
                ...zone,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2026-11-26T06:00:00Z",
                duration: { hours: 12 },
                ...zone,
            }),
        ).toBe(true);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "hour",
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(3_600_000);
    });

    it("reads weeks, quarters, fiscal years, and a month grid", () => {
        expect(
            getDayOfYear({ date: "2024-03-01T00:00:00Z", timeZone: "UTC" }),
        ).toBe(61);
        expect(
            getISOWeek({ date: "2026-01-01T00:00:00Z", timeZone: "UTC" }),
        ).toBe(1);
        expect(
            getISOWeekYear({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(2026);
        expect(getISOWeeksInYear(2020)).toBe(53);
        expect(getISOWeeksInYear(2021)).toBe(52);
        expect(
            getWeekOfYear({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                weekStartsOn: 1,
                minimumDaysInFirstWeek: 4,
            }),
        ).toBe(1);
        expect(
            getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" }),
        ).toBe(5);
        expect(
            getQuarter({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" }),
        ).toBe(4);
        expect(
            getFiscalYear({
                date: "2026-04-01T00:00:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "UTC",
            }),
        ).toBe(2027);
        expect(
            getFiscalYear({
                date: "2026-04-01T00:00:00Z",
                fiscalYearStartMonth: 4,
                fiscalYearLabel: "start-year",
                timeZone: "UTC",
            }),
        ).toBe(2026);
        expect(
            getFiscalQuarter({
                date: "2027-03-01T00:00:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "UTC",
            }),
        ).toBe(4);
        expect(
            getFiscalYearInterval({
                fiscalYear: 2027,
                fiscalYearStartMonth: 4,
                timeZone: "UTC",
            })?.start.toISOString(),
        ).toBe("2026-04-01T00:00:00.000Z");
        expect(() =>
            getFiscalYear({
                date: "2026-01-01T00:00:00Z",
                fiscalYearStartMonth: 13,
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(getLocaleWeekInfo("en-US").firstDay).toBe(7);
        const grid = createMonthCalendarGrid({
            year: 2021,
            month: 2,
            timeZone: "UTC",
            weekStartsOn: 1,
        });
        expect(grid).toBeDefined();
        expect(grid!.weeks)?.toHaveLength(4);
        expect(grid!.weeks[0]?.days[0]?.isInMonth).toBe(true);
        expect(
            createMonthCalendarGrid({
                year: 2026,
                month: 11,
                timeZone: "America/New_York",
                fixedWeekCount: true,
            })?.weeks,
        )?.toHaveLength(6);
    });
});
