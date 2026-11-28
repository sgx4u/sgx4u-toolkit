import { describe, expect, it } from "vitest";
import { differenceInUnit } from "../index.js";

describe("differenceInUnit", () => {
    it("truncates toward zero by default", () => {
        expect(
            differenceInUnit({
                later: "2026-03-01T00:00:00Z",
                earlier: "2026-01-31T00:00:00Z",
                unit: "month",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInUnit({
                later: "2026-01-01T01:30:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInUnit({
                later: "2026-01-01T01:30:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour",
                timeZone: "UTC",
                rounding: "truncate",
            }),
        ).toBe(1);
        expect(
            differenceInUnit({
                later: "2026-01-01T01:30:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour",
                timeZone: "UTC",
                rounding: "round",
            }),
        ).toBe(2);
        expect(
            differenceInUnit({
                later: "2026-01-01T01:30:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour",
                timeZone: "UTC",
                rounding: "ceil",
            }),
        ).toBe(2);
        expect(
            differenceInUnit({
                later: "2026-01-01T00:00:00Z",
                earlier: "2026-01-01T01:30:00Z",
                unit: "hour",
                timeZone: "UTC",
                rounding: "floor",
            }),
        ).toBe(-2);
    });

    it("counts a leap-day anniversary as one year and the extra day in February 2024", () => {
        expect(
            differenceInUnit({
                later: "2025-02-28T00:00:00Z",
                earlier: "2024-02-29T00:00:00Z",
                unit: "year",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            differenceInUnit({
                later: "2024-03-01T00:00:00Z",
                earlier: "2024-02-28T00:00:00Z",
                unit: "day",
                timeZone: "UTC",
            }),
        ).toBe(2);
        expect(
            differenceInUnit({
                later: "2025-01-01T00:00:00Z",
                earlier: "2024-12-31T00:00:00Z",
                unit: "day",
                timeZone: "UTC",
            }),
        ).toBe(1);
    });

    it("counts elapsed hours, not wall-clock hours, across the spring-forward gap", () => {
        expect(
            differenceInUnit({
                later: "2024-03-10T08:00:00Z",
                earlier: "2024-03-10T06:00:00Z",
                unit: "hour",
                timeZone: "America/New_York",
            }),
        ).toBe(2);
        expect(
            differenceInUnit({
                later: "2024-03-11T04:00:00Z",
                earlier: "2024-03-10T05:00:00Z",
                unit: "hour",
                timeZone: "America/New_York",
            }),
        ).toBe(23);
        expect(
            differenceInUnit({
                later: "2024-03-11T04:00:00Z",
                earlier: "2024-03-10T05:00:00Z",
                unit: "day",
                timeZone: "America/New_York",
            }),
        ).toBe(1);
    });

    it("rejects an unknown rounding mode and a date that does not parse", () => {
        expect(() =>
            differenceInUnit({
                later: "2026-01-01T01:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour",
                timeZone: "UTC",
                rounding: "up" as "truncate",
            }),
        ).toThrow(RangeError);
        expect(() =>
            differenceInUnit({
                later: "2026-01-01T01:00:00Z",
                earlier: "2026-01-01T00:00:00Z",
                unit: "hour",
                timeZone: "UTC",
                rounding: "up" as "truncate",
            }),
        ).toThrow(
            '`rounding` must be "truncate", "floor", "ceil", or "round"; received "up".',
        );
        expect(
            differenceInUnit({
                later: "nope",
                earlier: "2026-01-01T00:00:00Z",
                unit: "day",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
