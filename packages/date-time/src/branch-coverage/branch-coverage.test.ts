import { describe, expect, it } from "vitest";
import {
    addBusinessHours,
    formatDate,
    getSeason,
    isOpenAt,
    roundDuration,
    setDateParts,
    sortDates,
} from "../index.js";
import {
    describeCronExpression,
    getNextCronRuns,
    parseCronExpression,
} from "../cron.js";
import {
    listRecurrenceOccurrences,
    parseRecurrenceRule,
} from "../recurrence.js";
import { parseNaturalDate } from "../natural-language.js";

const utc = { timeZone: "UTC" as const };
const now = "2026-06-15T12:00:00Z";

describe("branch coverage", () => {
    it("formats the CLDR tokens and both season methods", () => {
        const text = formatDate(
            now,
            "G GGGG y yy yyyy M MM MMM MMMM E EEE EEEE Q QQ QQQ QQQQ d dd H HH m mm s ss S SS SSS",
            { ...utc, locale: "en-US" },
        );
        expect(text).toContain("2026");
        expect(text).toContain("June");
        const patterns = [
            "M/d/yy",
            "MMMM d",
            "EEE, MMM d",
            "h:mm a",
            "K:mm",
            "k",
            "HH:mm:ss.SSS",
            "XXX",
            "xx",
            "X",
            "x",
            "xxx",
            "O",
            "OOOO",
            "z",
            "zzzz",
            "VV",
            "w",
            "ww",
            "D",
            "DDD",
            "e",
            "ee",
            "Q",
            "QQ",
            "QQQ",
            "QQQQ",
            "'Today is' '' yyyy",
            "L LL LLL LLLL",
            "EEEEE",
            "MMMMM",
        ];
        for (const pattern of patterns) {
            expect(
                formatDate(now, pattern, {
                    timeZone: "Asia/Kolkata",
                    locale: "en-US",
                }).length,
            ).toBeGreaterThan(0);
        }
        expect(formatDate(now, "XXX", utc)).toBe("Z");
        expect(
            formatDate("2026-01-15T17:00:00Z", "xxx", {
                timeZone: "America/New_York",
            }),
        ).toContain("-");
        expect(() => formatDate(now, "ZZ", utc)).toThrow(RangeError);
        expect(getSeason(now, { ...utc, method: "astronomical" })).toBe(
            "spring",
        );
        expect(
            getSeason("2026-01-15T00:00:00Z", {
                ...utc,
                method: "astronomical",
                hemisphere: "southern",
            }),
        ).toBe("summer");
        expect(
            getSeason("2026-08-01T00:00:00Z", {
                ...utc,
                method: "astronomical",
            }),
        ).toBe("summer");
        expect(
            getSeason("2026-10-01T00:00:00Z", {
                ...utc,
                method: "astronomical",
            }),
        ).toBe("autumn");
        expect(
            getSeason("2026-12-25T00:00:00Z", {
                ...utc,
                method: "astronomical",
            }),
        ).toBe("winter");
        expect(() =>
            getSeason(now, { hemisphere: "east" as "northern" }),
        ).toThrow(RangeError);
    });

    it("rounds durations up, down, and by calendar unit", () => {
        expect(
            roundDuration(
                { minutes: 20 },
                { smallestUnit: "hour", mode: "up" },
            ),
        ).toEqual({
            hours: 1,
        });
        expect(
            roundDuration(
                { minutes: -90 },
                { smallestUnit: "hour", mode: "down" },
            ),
        ).toEqual({ hours: -1 });
        expect(
            roundDuration(
                { days: 40 },
                {
                    smallestUnit: "month",
                    relativeTo: "2026-01-15T00:00:00Z",
                    timeZone: "UTC",
                },
            ).months,
        ).toBeGreaterThan(0);
        expect(
            roundDuration(
                { days: 400 },
                {
                    smallestUnit: "year",
                    relativeTo: "2026-01-01T00:00:00Z",
                    timeZone: "UTC",
                },
            ).years,
        ).toBe(1);
        expect(
            roundDuration(
                { days: 100 },
                {
                    smallestUnit: "quarter",
                    relativeTo: "2026-01-01T00:00:00Z",
                    timeZone: "UTC",
                },
            ).months,
        ).toBeGreaterThan(0);
        expect(() =>
            roundDuration({ days: 1 }, { smallestUnit: "month" }),
        ).toThrow(RangeError);
    });

    it("parses cron marks and recurrence exclusions", () => {
        expect(parseCronExpression("0 0 L * *")?.lastDayOfMonth).toBe(true);
        expect(parseCronExpression("0 0 15W * *")?.nearestWeekdayToDay).toBe(
            15,
        );
        expect(
            parseCronExpression("0 0 * * 5L")?.lastWeekdayOfWeekInMonth,
        ).toEqual([5]);
        expect(parseCronExpression("0 0 * * 1#2")?.nthWeekdayOfMonth).toEqual([
            { dayOfWeek: 1, occurrence: 2 },
        ]);
        expect(parseCronExpression("@hourly")?.minutes).toEqual([0]);
        expect(parseCronExpression("*/15 9 * JAN MON")?.minutes.length).toBe(4);
        expect(parseCronExpression("@reboot")).toBeUndefined();
        expect(parseCronExpression("60 * * * *")).toBeUndefined();
        expect(parseCronExpression("0 0 1-5/2 * *")?.daysOfMonth).toEqual([
            1, 3, 5,
        ]);
        expect(parseCronExpression("0 0 LW * *")?.lastWeekdayOfMonth).toBe(
            true,
        );
        expect(parseCronExpression("0 0 L-3 * *")?.lastDayOfMonthOffset).toBe(
            3,
        );
        expect(
            parseCronExpression("0 0 * * ?", { seconds: "none" })?.daysOfWeek,
        ).toBe("any");
        expect(
            describeCronExpression("0 0 * * *", { hourCycle: "h23" }),
        ).toContain("00:00");
        expect(
            getNextCronRuns("0 0 L * *", {
                now,
                timeZone: "UTC",
                count: 1,
            })[0]?.getUTCDate(),
        ).toBe(30);
        const rule = parseRecurrenceRule(
            "DTSTART:20260131T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=3\nEXDATE:20260131T000000Z",
        );
        expect(rule).toBeDefined();
        if (rule !== undefined) {
            const dates = listRecurrenceOccurrences(rule, {
                between: {
                    start: new Date("2026-01-01T00:00:00Z"),
                    end: new Date("2026-06-01T00:00:00Z"),
                },
            });
            expect(dates.length).toBeGreaterThan(0);
            expect(dates[0]?.toISOString()).not.toBe(
                "2026-01-31T00:00:00.000Z",
            );
        }
    });

    it("covers overnight hours, sort order, and setDateParts overflow", () => {
        expect(
            isOpenAt(
                "2026-11-27T01:00:00Z",
                { hours: { 4: [{ start: "22:00", end: "02:00" }] } },
                utc,
            ),
        ).toBe(true);
        expect(
            addBusinessHours(
                "2026-11-26T11:00:00Z",
                { hours: -1 },
                utc,
            ).toISOString(),
        ).toBe("2026-11-26T10:00:00.000Z");
        const sorted = sortDates(
            ["2026-01-02T00:00:00Z", "2026-01-01T00:00:00Z"],
            { order: "descending" },
        );
        expect(sorted[0]?.toISOString()).toBe("2026-01-02T00:00:00.000Z");
        expect(() =>
            setDateParts(
                "2026-01-31T00:00:00Z",
                { month: 2, day: 31 },
                { ...utc, overflow: "reject" },
            ),
        ).toThrow(RangeError);
        expect(
            parseNaturalDate("last Monday", { now, ...utc })?.getUTCDay(),
        ).toBe(1);
        expect(parseNaturalDate("3 weeks ago", { now, ...utc })).toBeInstanceOf(
            Date,
        );
        expect(parseNaturalDate("noon", { now, ...utc })?.toISOString()).toBe(
            "2026-06-15T12:00:00.000Z",
        );
        for (const expression of [
            "",
            "1",
            "1 2 3 4",
            "0 0 0 0 0 0 0",
            "@yearly",
            "@monthly",
            "@weekly",
            "@daily",
            "@midnight",
            "0 0 0 * * SUN",
            "0 0 * * 1-5",
            "0 30 9-17 * * 1,3,5",
            "0 0 1W * *",
            "0 0 * FEB-APR MON-WED",
        ]) {
            parseCronExpression(expression);
        }
        for (const text of [
            "not a rule",
            "RRULE:FREQ=DAILY",
            "DTSTART:20260101T000000Z\nRRULE:FREQ=DAILY;COUNT=2;UNTIL=20260103T000000Z",
            "DTSTART:20260101T000000Z\nRRULE:FREQ=HOURLY;COUNT=2",
            "DTSTART:20260101T000000Z\nRRULE:FREQ=MINUTELY;COUNT=2",
            "DTSTART:20260101T000000Z\nRRULE:FREQ=SECONDLY;COUNT=2",
            "DTSTART:20260101T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=1;COUNT=1",
            "DTSTART:20260101T000000Z\nRRULE:FREQ=YEARLY;BYYEARDAY=100;COUNT=1",
            "DTSTART:20260101T120000Z\nRRULE:FREQ=DAILY;BYHOUR=9;BYMINUTE=0;BYSECOND=0;BYSETPOS=1;COUNT=1",
            "DTSTART;TZID=UTC:20260101T090000\nRRULE:FREQ=DAILY;INTERVAL=1;WKST=SU;COUNT=1\nRDATE:20260105T090000Z",
        ]) {
            const parsed = parseRecurrenceRule(text);
            if (parsed !== undefined) {
                listRecurrenceOccurrences(parsed, {
                    between: {
                        start: new Date("2026-01-01T00:00:00Z"),
                        end: new Date("2026-04-01T00:00:00Z"),
                    },
                    limit: 5,
                });
            }
        }
    });
});
