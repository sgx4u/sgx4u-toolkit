import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getWeekOfYear } from "../index.js";

const iso = {
    timeZone: "UTC" as const,
    weekStartsOn: 1 as const,
    minimumDaysInFirstWeek: 4,
};

describe("getWeekOfYear", () => {
    it("returns ISO week 1 for 1 January 2026", () => {
        expect(getWeekOfYear({ date: "2026-01-01T00:00:00Z", ...iso })).toBe(1);
    });

    it("puts 1 January 2021 in week 53 when week 1 needs four days", () => {
        expect(getWeekOfYear({ date: "2021-01-01T00:00:00Z", ...iso })).toBe(
            53,
        );
        expect(getWeekOfYear({ date: "2021-01-04T00:00:00Z", ...iso })).toBe(1);
        expect(getWeekOfYear({ date: "2020-12-31T00:00:00Z", ...iso })).toBe(
            53,
        );
        expect(
            getWeekOfYear({
                date: "2026-12-31T00:00:00Z",
                timeZone: "UTC",
                weekStartsOn: 7,
                minimumDaysInFirstWeek: 1,
            }),
        ).toBeGreaterThan(0);
    });

    it("rejects a minimum outside 1 through 7 or a date that is not real", () => {
        expect(() =>
            getWeekOfYear({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                minimumDaysInFirstWeek: 0,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getWeekOfYear({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                minimumDaysInFirstWeek: 0,
            }),
        ).toThrow("`minimumDaysInFirstWeek`");
        expect(() =>
            getWeekOfYear({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                minimumDaysInFirstWeek: 8,
            }),
        ).toThrow("`minimumDaysInFirstWeek`");
        expect(
            getWeekOfYear({ date: "nope", timeZone: "UTC" }),
        ).toBeUndefined();
        expect(
            getWeekOfYear({ date: null as never, timeZone: "UTC" }),
        ).toBeUndefined();
        expect(() =>
            getWeekOfYear({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                weekStartsOn: 0 as never,
            }),
        ).toThrow("`weekStartsOn`");
    });

    it("defaults the week start to Monday and the first week to one day", () => {
        const date = "2021-01-01T00:00:00Z";
        expect(getWeekOfYear({ date: date, timeZone: "UTC" })).toBe(1);
        expect(getWeekOfYear({ date: date, timeZone: "UTC" })).toBe(
            getWeekOfYear({
                date: date,
                timeZone: "UTC",
                weekStartsOn: 1,
                minimumDaysInFirstWeek: 1,
            }),
        );
        expect(getWeekOfYear({ date: date })).toBe(
            getWeekOfYear({ date: date, timeZone: getLocalTimeZone() }),
        );
    });

    it("reads 04:00 UTC on 1 January 2024 as the previous ISO week in New York", () => {
        expect(getWeekOfYear({ date: "2024-01-01T04:00:00Z", ...iso })).toBe(1);
        expect(
            getWeekOfYear({
                date: "2024-01-01T04:00:00Z",
                ...iso,
                timeZone: "America/New_York",
            }),
        ).toBe(52);
    });
});
