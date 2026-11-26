import { describe, expect, it } from "vitest";
import { getDateParts, isYesterday } from "../index.js";

describe("isYesterday", () => {
    it("matches the previous calendar day and no other day", () => {
        const options = {
            now: "2026-11-26T15:00:00Z",
            timeZone: "UTC",
        };

        expect(isYesterday({ date: "2026-11-25T00:00:00Z", ...options })).toBe(
            true,
        );
        expect(
            isYesterday({ date: "2026-11-25T23:59:59.999Z", ...options }),
        ).toBe(true);
        expect(isYesterday({ date: "2026-11-26T00:00:00Z", ...options })).toBe(
            false,
        );
        expect(
            isYesterday({ date: "2026-11-24T23:59:59.999Z", ...options }),
        ).toBe(false);
        expect(isYesterday({ date: options.now, ...options })).toBe(false);
    });

    it("crosses leap day, month end, and the year bounds", () => {
        expect(
            isYesterday({
                date: "2024-02-29T18:00:00Z",
                now: "2024-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2024-02-28T00:00:00Z",
                now: "2024-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isYesterday({
                date: "2023-02-28T00:00:00Z",
                now: "2023-03-01T12:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2026-01-31T23:00:00Z",
                now: "2026-02-01T00:30:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2025-12-31T00:00:00Z",
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "0000-12-31T12:00:00Z",
                now: "0001-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "9999-12-30T00:00:00Z",
                now: "9999-12-31T23:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "0000-02-29T00:00:00Z",
                now: "0000-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
    });

    it("uses the zone's calendar day across midnight and daylight saving", () => {
        const now = "2026-11-26T04:00:00Z";

        expect(
            isYesterday({ date: "2026-11-25T12:00:00Z", now, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2026-11-25T12:00:00Z",
                now,
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isYesterday({
                date: "2026-11-24T12:00:00Z",
                now,
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2024-03-09T05:00:00Z",
                now: "2024-03-10T12:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2024-03-10T04:00:00Z",
                now: "2024-03-10T12:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2024-03-10T07:00:00Z",
                now: "2024-03-10T12:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isYesterday({
                date: "2024-09-07T04:00:00Z",
                now: "2024-09-08T15:00:00Z",
                timeZone: "America/Santiago",
            }),
        ).toBe(true);
        expect(
            isYesterday({
                date: "2024-09-08T04:00:00Z",
                now: "2024-09-08T15:00:00Z",
                timeZone: "America/Santiago",
            }),
        ).toBe(false);
    });

    it("follows the system zone when timeZone is omitted", () => {
        const now = "2026-06-15T12:00:00Z";
        const candidate = "2026-06-14T12:00:00Z";
        const today = getDateParts({ date: now });
        const previous = getDateParts({ date: candidate });

        expect(today).toBeDefined();
        expect(previous).toBeDefined();
        expect(isYesterday({ date: candidate, now })).toBe(
            today!.year === previous!.year &&
                today!.month === previous!.month &&
                today!.day === previous!.day + 1,
        );
    });

    it("throws when a date or the time zone is invalid", () => {
        const options = { now: "2026-11-26T00:00:00Z", timeZone: "UTC" };

        expect(isYesterday({ date: "2024-02-30", ...options })).toBe(false);
        expect(isYesterday({ date: new Date(Number.NaN), ...options })).toBe(
            false,
        );
        expect(
            isYesterday({ date: null as unknown as string, ...options }),
        ).toBe(false);
        expect(
            isYesterday({
                date: "2026-11-25T00:00:00Z",
                now: "not-a-date",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(() =>
            isYesterday({
                date: "2026-11-25T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
    });
});
