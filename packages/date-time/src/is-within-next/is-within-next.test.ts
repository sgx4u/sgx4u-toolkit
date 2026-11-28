import { describe, expect, it } from "vitest";
import { isWithinNext } from "../index.js";

describe("isWithinNext", () => {
    it("includes now and the far end of the window", () => {
        const options = {
            now: "2026-01-01T00:00:00Z",
            timeZone: "UTC",
        };

        expect(
            isWithinNext({
                date: "2026-01-01T00:00:00Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2026-01-02T00:00:00Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2025-12-31T23:59:59.999Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: "2026-01-02T00:00:00.001Z",
                duration: { hours: 24 },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinNext({ date: options.now, duration: {}, ...options }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2026-01-01T00:00:00.001Z",
                duration: {},
                ...options,
            }),
        ).toBe(false);
    });

    it("clamps month and year steps on leap day and month end", () => {
        expect(
            isWithinNext({
                date: "2024-02-29T00:00:00Z",
                duration: { months: 1 },
                now: "2024-01-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2024-03-01T00:00:00Z",
                duration: { months: 1 },
                now: "2024-01-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: "2026-02-28T00:00:00Z",
                duration: { months: 1 },
                now: "2026-01-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2026-03-01T00:00:00Z",
                duration: { months: 1 },
                now: "2026-01-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: "2024-02-28T00:00:00Z",
                duration: { years: 1 },
                now: "2023-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2024-02-29T00:00:00Z",
                duration: { years: 1 },
                now: "2023-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: "0000-02-29T00:00:00Z",
                duration: { days: 1 },
                now: "0000-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "9999-12-31T00:00:00Z",
                duration: { days: 1 },
                now: "9999-12-30T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
    });

    it("keeps wall-clock days across the New York spring-forward", () => {
        const now = {
            now: "2024-03-09T14:00:00Z",
            timeZone: "America/New_York",
        };

        expect(
            isWithinNext({
                date: "2024-03-10T13:00:00Z",
                duration: { days: 1 },
                ...now,
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2024-03-10T13:00:00.001Z",
                duration: { days: 1 },
                ...now,
            }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: "2024-03-10T14:00:00Z",
                duration: { hours: 24 },
                ...now,
            }),
        ).toBe(true);
        expect(
            isWithinNext({
                date: "2024-03-10T14:00:00Z",
                duration: { days: 1 },
                ...now,
            }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: "2024-03-10T14:00:00Z",
                duration: { days: 1 },
                now: "2024-03-09T14:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
    });

    it("throws when the duration is negative or an argument is invalid", () => {
        const options = { now: "2026-01-01T00:00:00Z", timeZone: "UTC" };

        expect(() =>
            isWithinNext({
                date: options.now,
                duration: { hours: -1 },
                ...options,
            }),
        ).toThrow(RangeError);
        expect(
            isWithinNext({
                date: options.now,
                duration: [] as unknown as { hours: number },
                ...options,
            }),
        ).toBe(false);
        expect(
            isWithinNext({ date: "nope", duration: { days: 1 }, ...options }),
        ).toBe(false);
        expect(
            isWithinNext({
                date: null as unknown as string,
                duration: { days: 1 },
                ...options,
            }),
        ).toBe(false);
        expect(() =>
            isWithinNext({
                date: options.now,
                duration: { days: 1 },
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
    });
});
