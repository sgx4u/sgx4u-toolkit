import { describe, expect, it } from "vitest";
import { compareDurations } from "../index.js";

describe("compareDurations", () => {
    it("orders clock durations without a reference date", () => {
        expect(compareDurations({ hours: 2 }, { minutes: 90 })).toBe(1);
        expect(compareDurations({ minutes: 90 }, { hours: 2 })).toBe(-1);
        expect(
            compareDurations({ hours: 1, minutes: 30 }, { minutes: 90 }),
        ).toBe(0);
    });

    it("measures a leap-year month and a 366-day year from a reference date", () => {
        expect(
            compareDurations(
                { months: 1 },
                { days: 29 },
                {
                    relativeTo: "2024-01-31T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(0);
        expect(
            compareDurations(
                { months: 1 },
                { days: 28 },
                {
                    relativeTo: "2023-01-31T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(0);
        expect(
            compareDurations(
                { years: 1 },
                { days: 366 },
                {
                    relativeTo: "2024-01-01T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(0);
        expect(
            compareDurations(
                { years: 1 },
                { days: 365 },
                {
                    relativeTo: "2024-01-01T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(1);
    });

    it("treats one calendar day as shorter than 24 hours across the spring-forward gap", () => {
        expect(
            compareDurations(
                { days: 1 },
                { hours: 24 },
                {
                    relativeTo: "2024-03-10T06:00:00Z",
                    timeZone: "America/New_York",
                },
            ),
        ).toBe(-1);
    });

    it("requires relativeTo for months and rejects a mixed-sign duration", () => {
        expect(() => compareDurations({ months: 1 }, { days: 30 })).toThrow(
            RangeError,
        );
        expect(() => compareDurations({ months: 1 }, { days: 30 })).toThrow(
            "`duration` must be free of months and years, or pass `relativeTo`; received [object Object].",
        );
        expect(() =>
            compareDurations({ hours: 1, days: -1 }, { hours: 1 }),
        ).toThrow(RangeError);
    });
});
