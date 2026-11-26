import { describe, expect, it } from "vitest";
import { differenceAsDuration } from "../index.js";

describe("differenceAsDuration", () => {
    it("returns whole hours and keeps a fractional millisecond remainder", () => {
        expect(
            differenceAsDuration({
                later: "2026-01-01T01:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ hours: 1 });
        expect(
            differenceAsDuration({
                later: 1_500,
                earlier: 0,
                timeZone: "UTC",
                largestUnit: "second",
            }),
        ).toEqual({ seconds: 1, milliseconds: 500 });
    });

    it("breaks a leap-day anniversary and a year boundary into calendar fields", () => {
        expect(
            differenceAsDuration({
                later: "2025-03-01T00:00:00Z",
                earlier: "2024-02-29T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual({ years: 1, days: 1 });
        expect(
            differenceAsDuration({
                later: "2025-01-01T12:00:00Z",
                earlier: "2024-12-31T00:00:00Z",
                timeZone: "UTC",
                largestUnit: "day",
            }),
        ).toEqual({ days: 1, hours: 12 });
    });

    it("counts two elapsed hours across the New York spring-forward gap", () => {
        expect(
            differenceAsDuration({
                later: "2024-03-10T08:00:00Z",
                earlier: "2024-03-10T06:00:00Z",
                timeZone: "America/New_York",
                largestUnit: "hour",
            }),
        ).toEqual({ hours: 2 });
    });

    it("rejects a smallest unit larger than the largest unit and a date that does not parse", () => {
        expect(() =>
            differenceAsDuration({
                later: "2026-01-02T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                largestUnit: "day",
                smallestUnit: "year",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            differenceAsDuration({
                later: "2026-01-02T00:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                largestUnit: "day",
                smallestUnit: "year",
                timeZone: "UTC",
            }),
        ).toThrow(
            '`smallestUnit` must be a unit no larger than `day`; received "year".',
        );
        expect(
            differenceAsDuration({
                later: "nope",
                earlier: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
