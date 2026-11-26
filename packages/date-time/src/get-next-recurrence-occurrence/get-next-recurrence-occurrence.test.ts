import { describe, expect, it } from "vitest";
import { getNextRecurrenceOccurrence } from "../recurrence.js";

const daily = {
    start: new Date("2026-11-26T09:00:00.000Z"),
    frequency: "daily" as const,
};

describe("getNextRecurrenceOccurrence", () => {
    it("returns the following daily occurrence", () => {
        expect(
            getNextRecurrenceOccurrence(daily, {
                now: "2026-11-26T09:00:00Z",
            })?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
    });

    it("includes now only when asked and stops at count or until", () => {
        expect(
            getNextRecurrenceOccurrence(daily, {
                now: "2026-11-26T09:00:00Z",
                includeNow: true,
            })?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getNextRecurrenceOccurrence(daily, {
                now: "2026-11-25T09:00:00Z",
            })?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getNextRecurrenceOccurrence(
                { ...daily, count: 1 },
                { now: "2026-11-26T09:00:00Z" },
            ),
        ).toBeUndefined();
        expect(
            getNextRecurrenceOccurrence(
                { ...daily, until: new Date("2026-11-26T09:00:00.000Z") },
                { now: "2026-11-26T09:00:00Z" },
            ),
        ).toBeUndefined();
        expect(
            getNextRecurrenceOccurrence(
                {
                    ...daily,
                    excludedDates: [new Date("2026-11-27T09:00:00.000Z")],
                },
                { now: "2026-11-26T09:00:00Z" },
            )?.toISOString(),
        ).toBe("2026-11-28T09:00:00.000Z");
    });

    it("rejects a now that is not a real date", () => {
        expect(() =>
            getNextRecurrenceOccurrence(daily, { now: "nope" }),
        ).toThrow(RangeError);
        expect(() =>
            getNextRecurrenceOccurrence(daily, { now: "nope" }),
        ).toThrow("`now`");
        expect(() =>
            getNextRecurrenceOccurrence(daily, { now: null as never }),
        ).toThrow(TypeError);
        expect(() =>
            getNextRecurrenceOccurrence(daily, { now: null as never }),
        ).toThrow("`now`");
    });

    it("excludes now and evaluates a floating rule in UTC", () => {
        const now = "2026-11-26T09:00:00Z";
        expect(getNextRecurrenceOccurrence(daily, { now })?.toISOString()).toBe(
            getNextRecurrenceOccurrence(daily, {
                now,
                includeNow: false,
            })?.toISOString(),
        );
        expect(
            getNextRecurrenceOccurrence(
                { ...daily, timeZone: "UTC" },
                { now },
            )?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
    });

    it("keeps 09:00 wall time across the New York spring-forward", () => {
        expect(
            getNextRecurrenceOccurrence(
                {
                    start: new Date("2024-03-09T14:00:00.000Z"),
                    frequency: "daily",
                    timeZone: "America/New_York",
                },
                { now: "2024-03-09T14:00:00Z" },
            )?.toISOString(),
        ).toBe("2024-03-10T13:00:00.000Z");
    });
});
