import { describe, expect, it } from "vitest";
import { formatRelativeCalendarDay } from "../index.js";

const zone = { timeZone: "UTC", locale: "en" };

describe("formatRelativeCalendarDay", () => {
    it("says today, yesterday, and tomorrow with a short time by default", () => {
        const now = "2026-01-02T12:00:00Z";
        expect(
            formatRelativeCalendarDay({
                date: "2026-01-02T17:00:00Z",
                ...zone,
                now,
            }),
        ).toBe("Today at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2026-01-01T17:00:00Z",
                ...zone,
                now,
            }),
        ).toBe("Yesterday at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2026-01-03T17:00:00Z",
                ...zone,
                now,
            }),
        ).toBe("Tomorrow at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2026-01-02T17:00:00Z",
                ...zone,
                now,
                timeStyle: "short",
            }),
        ).toBe("Today at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2026-01-02T17:00:00Z",
                ...zone,
                now,
                timeStyle: "medium",
            }),
        ).toBe("Today at 5:00:00 PM");
    });

    it("uses the weekday inside six days, a full date beyond that, and names the leap day and New Year", () => {
        expect(
            formatRelativeCalendarDay({
                date: "2026-01-06T17:00:00Z",
                ...zone,
                now: "2026-01-02T12:00:00Z",
            }),
        ).toBe("Tuesday at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2026-02-01T17:00:00Z",
                ...zone,
                now: "2026-01-02T12:00:00Z",
            }),
        ).toBe("Feb 1, 2026, 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2024-02-29T17:00:00Z",
                ...zone,
                now: "2024-03-01T12:00:00Z",
            }),
        ).toBe("Yesterday at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2025-01-01T17:00:00Z",
                ...zone,
                now: "2024-12-31T12:00:00Z",
            }),
        ).toBe("Tomorrow at 5:00 PM");
        expect(
            formatRelativeCalendarDay({
                date: "2024-12-31T17:00:00Z",
                ...zone,
                now: "2025-01-01T12:00:00Z",
            }),
        ).toBe("Yesterday at 5:00 PM");
    });

    it("shows 1:30 and 3:30 on the spring-forward morning in New York", () => {
        const now = "2024-03-10T16:00:00Z";
        const options = {
            now,
            timeZone: "America/New_York",
            locale: "en-US",
        };
        expect(
            formatRelativeCalendarDay({
                date: "2024-03-10T06:30:00Z",
                ...options,
            }),
        ).toBe("Today at 1:30 AM");
        expect(
            formatRelativeCalendarDay({
                date: "2024-03-10T07:30:00Z",
                ...options,
            }),
        ).toBe("Today at 3:30 AM");
        expect(
            formatRelativeCalendarDay({
                date: "2024-11-03T05:30:00Z",
                now: "2024-11-03T16:00:00Z",
                timeZone: "America/New_York",
                locale: "en-US",
            }),
        ).toBe("Today at 1:30 AM");
        expect(
            formatRelativeCalendarDay({
                date: "2024-11-03T06:30:00Z",
                now: "2024-11-03T16:00:00Z",
                timeZone: "America/New_York",
                locale: "en-US",
            }),
        ).toBe("Today at 1:30 AM");
    });

    it("rejects an unknown time style and a date that does not parse", () => {
        expect(() =>
            formatRelativeCalendarDay({
                date: "2026-01-02T00:00:00Z",
                now: "2026-01-02T00:00:00Z",
                timeStyle: "long" as "short",
            }),
        ).toThrow(RangeError);
        expect(() =>
            formatRelativeCalendarDay({
                date: "2026-01-02T00:00:00Z",
                now: "2026-01-02T00:00:00Z",
                timeStyle: "long" as "short",
            }),
        ).toThrow('`timeStyle` must be "short" or "medium"; received "long".');
        expect(
            formatRelativeCalendarDay({
                date: "nope",
                now: "2026-01-02T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
