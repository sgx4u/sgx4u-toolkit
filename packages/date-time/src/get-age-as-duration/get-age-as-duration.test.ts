import { describe, expect, it } from "vitest";
import { getAgeAsDuration } from "../index.js";

describe("getAgeAsDuration", () => {
    it("counts years, months, and days and omits zero fields", () => {
        expect(
            getAgeAsDuration("2020-01-31", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ years: 1, months: 1, days: 1 });
        expect(
            getAgeAsDuration("2019-12-31", {
                now: "2020-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ days: 1 });
        expect(
            getAgeAsDuration("2020-06-15T15:00:00Z", {
                now: "2020-06-15T18:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({});
    });

    it("reaches a leap-day birthday on March 1 unless the policy says February 28", () => {
        expect(
            getAgeAsDuration("2000-02-29", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ years: 21 });
        expect(
            getAgeAsDuration("2000-02-29", {
                now: "2021-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ years: 20, months: 12 });
        expect(
            getAgeAsDuration("2000-02-29", {
                now: "2021-02-28T12:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "february-28",
            }),
        ).toEqual({ years: 21 });
        expect(
            getAgeAsDuration("2024-01-31", {
                now: "2024-02-29T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ months: 1 });
    });

    it("uses the calendar day in the zone, including a daylight-saving midnight", () => {
        expect(
            getAgeAsDuration("2000-02-29", {
                now: "2021-02-28T18:29:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toEqual({ years: 20, months: 12 });
        expect(
            getAgeAsDuration("2000-02-29", {
                now: "2021-02-28T18:30:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toEqual({ years: 21 });
        expect(
            getAgeAsDuration("2025-03-09T05:00:00Z", {
                now: "2026-03-09T04:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toEqual({ years: 1 });
    });

    it("throws when the birth date is after now or the policy is unknown", () => {
        expect(() =>
            getAgeAsDuration("2026-01-02T00:00:00Z", {
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getAgeAsDuration("2026-01-02T00:00:00Z", {
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toThrow("a date at or before `now`");
        expect(() =>
            getAgeAsDuration("2000-02-29", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "april" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getAgeAsDuration("2000-02-29", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "april" as never,
            }),
        ).toThrow('"march-1" or "february-28"');
        expect(() => getAgeAsDuration(null as never, { now: 0 })).toThrow(
            TypeError,
        );
        expect(() => getAgeAsDuration(null as never, { now: 0 })).toThrow(
            "`birthDate` must be a Date",
        );
    });
});
