import { describe, expect, it } from "vitest";
import { getIntervalDuration } from "../index.js";

describe("getIntervalDuration", () => {
    it("defaults to days and omits zero fields", () => {
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date(0),
                    end: new Date(90 * 60 * 1000),
                },
            }),
        ).toEqual({ hours: 1, minutes: 30 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-01-31T00:00:00Z"),
                    end: new Date("2026-03-01T00:00:00Z"),
                },
                timeZone: "UTC",
            }),
        ).toEqual({ days: 29 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-01-01T00:00:00Z"),
                    end: new Date("2026-01-01T00:00:00Z"),
                },
            }),
        ).toEqual({});
    });

    it("counts a leap day and a year boundary", () => {
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2024-02-28T00:00:00Z"),
                    end: new Date("2024-03-01T00:00:00Z"),
                },
                timeZone: "UTC",
                largestUnit: "day",
            }),
        ).toEqual({ days: 2 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-01-01T00:00:00Z"),
                    end: new Date("2027-01-01T00:00:00Z"),
                },
                timeZone: "UTC",
                largestUnit: "year",
            }),
        ).toEqual({ years: 1 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-12-31T00:00:00Z"),
                    end: new Date("2027-01-01T06:00:00Z"),
                },
                timeZone: "UTC",
                largestUnit: "year",
            }),
        ).toEqual({ days: 1, hours: 6 });
    });

    it("uses local days across daylight saving and a Kolkata midnight", () => {
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-03-08T05:00:00.000Z"),
                    end: new Date("2026-03-09T04:00:00.000Z"),
                },
                timeZone: "America/New_York",
                largestUnit: "hour",
            }),
        ).toEqual({ hours: 23 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-03-08T05:00:00.000Z"),
                    end: new Date("2026-03-09T04:00:00.000Z"),
                },
                timeZone: "America/New_York",
                largestUnit: "day",
            }),
        ).toEqual({ days: 1 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-11-01T04:00:00.000Z"),
                    end: new Date("2026-11-02T05:00:00.000Z"),
                },
                timeZone: "America/New_York",
                largestUnit: "hour",
            }),
        ).toEqual({ hours: 25 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-11-01T04:00:00.000Z"),
                    end: new Date("2026-11-02T05:00:00.000Z"),
                },
                timeZone: "America/New_York",
            }),
        ).toEqual({ days: 1 });
        expect(
            getIntervalDuration({
                interval: {
                    start: new Date("2026-03-31T18:30:00Z"),
                    end: new Date("2026-04-01T18:30:00Z"),
                },
                timeZone: "Asia/Kolkata",
            }),
        ).toEqual({ days: 1 });
    });

    it("returns undefined when the interval is invalid", () => {
        expect(
            getIntervalDuration({
                interval: { start: new Date(10), end: new Date(0) },
            }),
        ).toBeUndefined();
        expect(
            getIntervalDuration({ interval: null as never }),
        ).toBeUndefined();
    });

    it("throws when the largest unit is invalid", () => {
        expect(() =>
            getIntervalDuration({
                interval: { start: new Date(0), end: new Date(1) },
                largestUnit: "decade" as never,
            }),
        ).toThrow(RangeError);
    });
});
