import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getWeekOfYear } from "../index.js";

const iso = {
    timeZone: "UTC" as const,
    weekStartsOn: 1 as const,
    minimumDaysInFirstWeek: 4,
};

describe("getWeekOfYear", () => {
    it("returns ISO week 1 for 1 January 2026", () => {
        expect(getWeekOfYear("2026-01-01T00:00:00Z", iso)).toBe(1);
    });

    it("puts 1 January 2021 in week 53 when week 1 needs four days", () => {
        expect(getWeekOfYear("2021-01-01T00:00:00Z", iso)).toBe(53);
        expect(getWeekOfYear("2021-01-04T00:00:00Z", iso)).toBe(1);
        expect(getWeekOfYear("2020-12-31T00:00:00Z", iso)).toBe(53);
        expect(
            getWeekOfYear("2026-12-31T00:00:00Z", {
                timeZone: "UTC",
                weekStartsOn: 7,
                minimumDaysInFirstWeek: 1,
            }),
        ).toBeGreaterThan(0);
    });

    it("rejects a minimum outside 1 through 7 or a date that is not real", () => {
        expect(() =>
            getWeekOfYear("2026-01-01T00:00:00Z", {
                timeZone: "UTC",
                minimumDaysInFirstWeek: 0,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getWeekOfYear("2026-01-01T00:00:00Z", {
                timeZone: "UTC",
                minimumDaysInFirstWeek: 0,
            }),
        ).toThrow("`minimumDaysInFirstWeek`");
        expect(() =>
            getWeekOfYear("2026-01-01T00:00:00Z", {
                timeZone: "UTC",
                minimumDaysInFirstWeek: 8,
            }),
        ).toThrow("`minimumDaysInFirstWeek`");
        expect(() => getWeekOfYear("nope", { timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() => getWeekOfYear(null, { timeZone: "UTC" })).toThrow(
            TypeError,
        );
        expect(() =>
            getWeekOfYear("2026-01-01T00:00:00Z", {
                timeZone: "UTC",
                weekStartsOn: 0,
            }),
        ).toThrow("`weekStartsOn`");
    });

    it("defaults the week start to Monday and the first week to one day", () => {
        const date = "2021-01-01T00:00:00Z";
        expect(getWeekOfYear(date, { timeZone: "UTC" })).toBe(1);
        expect(getWeekOfYear(date, { timeZone: "UTC" })).toBe(
            getWeekOfYear(date, {
                timeZone: "UTC",
                weekStartsOn: 1,
                minimumDaysInFirstWeek: 1,
            }),
        );
        expect(getWeekOfYear(date)).toBe(
            getWeekOfYear(date, { timeZone: getLocalTimeZone() }),
        );
    });

    it("reads 04:00 UTC on 1 January 2024 as the previous ISO week in New York", () => {
        expect(getWeekOfYear("2024-01-01T04:00:00Z", iso)).toBe(1);
        expect(
            getWeekOfYear("2024-01-01T04:00:00Z", {
                ...iso,
                timeZone: "America/New_York",
            }),
        ).toBe(52);
    });
});
