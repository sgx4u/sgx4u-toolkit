import { describe, expect, it } from "vitest";
import { isWithinLast } from "../index.js";

const UTCNow = {
    now: "2026-03-31T00:00:00Z",
    timeZone: "UTC",
};

describe("isWithinLast", () => {
    it("includes both ends of a positive window", () => {
        const options = {
            now: "2026-01-01T00:00:00Z",
            timeZone: "UTC",
        };

        expect(
            isWithinLast({
                date: "2026-01-01T00:00:00Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2025-12-31T00:00:00Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2025-12-30T23:59:59.999Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "2026-01-01T00:00:00.001Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinLast({ date: options.now, duration: {}, ...options }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2025-12-31T23:59:59.999Z",
                duration: {},
                ...options,
            }),
        ).toBe(false);
    });

    it("clamps a month and a year onto leap day and month end", () => {
        expect(
            isWithinLast({
                date: "2026-02-28T00:00:00Z",
                duration: { months: 1 },
                ...UTCNow,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2026-02-27T23:59:59.999Z",
                duration: { months: 1 },
                ...UTCNow,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "2024-02-29T00:00:00Z",
                duration: { months: 1 },
                now: "2024-03-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2024-02-28T23:59:59.999Z",
                duration: { months: 1 },
                now: "2024-03-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "2023-02-28T00:00:00Z",
                duration: { years: 1 },
                now: "2024-02-29T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2023-02-27T00:00:00Z",
                duration: { years: 1 },
                now: "2024-02-29T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "0000-12-31T00:00:00Z",
                duration: { days: 1 },
                now: "0001-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "9999-12-30T00:00:00Z",
                duration: { days: 1 },
                now: "9999-12-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
    });

    it("measures calendar days and clock hours differently across daylight saving", () => {
        const now = {
            now: "2024-03-10T13:00:00Z",
            timeZone: "America/New_York",
        };

        expect(
            isWithinLast({
                date: "2024-03-09T14:00:00Z",
                duration: { days: 1 },
                ...now,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2024-03-09T13:59:59.999Z",
                duration: { days: 1 },
                ...now,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "2024-03-09T13:59:59.999Z",
                duration: { hours: 24 },
                ...now,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2024-03-09T13:00:00Z",
                duration: { hours: 24 },
                ...now,
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2024-03-09T12:59:59.999Z",
                duration: { hours: 24 },
                ...now,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "2024-11-03T04:00:00Z",
                duration: { days: 1 },
                now: "2024-11-04T05:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isWithinLast({
                date: "2024-11-03T03:59:59.999Z",
                duration: { days: 1 },
                now: "2024-11-04T05:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(false);
    });

    it("throws when the duration is negative or an argument is invalid", () => {
        const options = { now: "2026-01-01T00:00:00Z", timeZone: "UTC" };

        expect(() =>
            isWithinLast({
                date: options.now,
                duration: { days: -1 },
                ...options,
            }),
        ).toThrow(RangeError);
        expect(
            isWithinLast({
                date: options.now,
                duration: { days: 1, hours: -1 },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: options.now,
                duration: null as unknown as { days: number },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: "2024-02-30",
                duration: { days: 1 },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinLast({
                date: options.now,
                duration: { days: 1 },
                now: "not-a-date",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(() =>
            isWithinLast({
                date: options.now,
                duration: { days: 1 },
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
    });
});
