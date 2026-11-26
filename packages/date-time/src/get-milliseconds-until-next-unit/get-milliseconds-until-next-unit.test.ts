import { describe, expect, it } from "vitest";
import { getMillisecondsUntilNextUnit } from "../index.js";

describe("getMillisecondsUntilNextUnit", () => {
    it("returns a full unit at an exact boundary and never zero", () => {
        expect(
            getMillisecondsUntilNextUnit({
                unit: "hour",
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(3_600_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "minute",
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(60_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "minute",
                now: "2026-01-01T00:00:30.250Z",
                timeZone: "UTC",
            }),
        ).toBe(29_750);
    });

    it("waits out a year boundary and honors the week start", () => {
        expect(
            getMillisecondsUntilNextUnit({
                unit: "day",
                now: "2026-12-31T23:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(3_600_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "week",
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(345_600_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "week",
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                weekStartsOn: 1,
            }),
        ).toBe(345_600_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "week",
                now: "2026-01-04T00:00:00Z",
                timeZone: "UTC",
                weekStartsOn: 7,
            }),
        ).toBe(604_800_000);
    });

    it("stops at the next real hour across daylight saving", () => {
        expect(
            getMillisecondsUntilNextUnit({
                unit: "hour",
                now: "2026-03-08T06:30:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(1_800_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "hour",
                now: "2026-11-01T05:30:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(1_800_000);
        expect(
            getMillisecondsUntilNextUnit({
                unit: "day",
                now: "2026-04-01T18:00:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(1_800_000);
    });

    it("throws for an unknown unit or a now that is not a date", () => {
        expect(() =>
            getMillisecondsUntilNextUnit({
                unit: "decade" as never,
                now: "2026-01-01T00:00:00Z",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getMillisecondsUntilNextUnit({
                unit: "decade" as never,
                now: "2026-01-01T00:00:00Z",
            }),
        ).toThrow("`unit` must be a time unit");
        expect(() =>
            getMillisecondsUntilNextUnit({ unit: null as never, now: 0 }),
        ).toThrow(TypeError);
        expect(() =>
            getMillisecondsUntilNextUnit({ unit: null as never, now: 0 }),
        ).toThrow("`unit` must be a time unit");
        expect(
            getMillisecondsUntilNextUnit({ unit: "hour", now: "nope" }),
        ).toBeUndefined();
    });
});
