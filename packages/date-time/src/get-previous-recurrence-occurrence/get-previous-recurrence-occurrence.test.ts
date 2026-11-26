import { describe, expect, it } from "vitest";
import { getPreviousRecurrenceOccurrence } from "../recurrence.js";

const daily = {
    start: new Date("2026-11-26T09:00:00.000Z"),
    frequency: "daily" as const,
};

describe("getPreviousRecurrenceOccurrence", () => {
    it("returns the daily occurrence before now", () => {
        expect(
            getPreviousRecurrenceOccurrence(daily, {
                now: "2026-11-28T09:00:00Z",
            })?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
    });

    it("includes now only when asked and has nothing before the start", () => {
        expect(
            getPreviousRecurrenceOccurrence(daily, {
                now: "2026-11-28T09:00:00Z",
                includeNow: true,
            })?.toISOString(),
        ).toBe("2026-11-28T09:00:00.000Z");
        expect(
            getPreviousRecurrenceOccurrence(daily, {
                now: "2026-11-26T09:00:00Z",
            }),
        ).toBeUndefined();
        expect(
            getPreviousRecurrenceOccurrence(
                { ...daily, count: 1 },
                { now: "2026-11-28T09:00:00Z" },
            )?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getPreviousRecurrenceOccurrence(
                {
                    ...daily,
                    excludedDates: [new Date("2026-11-27T09:00:00.000Z")],
                },
                { now: "2026-11-28T09:00:00Z" },
            )?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
    });

    it("rejects a now that is not a real date", () => {
        expect(() =>
            getPreviousRecurrenceOccurrence(daily, { now: "nope" }),
        ).toThrow(RangeError);
        expect(() =>
            getPreviousRecurrenceOccurrence(daily, { now: "nope" }),
        ).toThrow("`now`");
        expect(() =>
            getPreviousRecurrenceOccurrence(daily, { now: null as never }),
        ).toThrow(TypeError);
        expect(() =>
            getPreviousRecurrenceOccurrence(daily, { now: null as never }),
        ).toThrow("`now`");
    });

    it("excludes now and evaluates a floating rule in UTC", () => {
        const now = "2026-11-28T09:00:00Z";
        expect(
            getPreviousRecurrenceOccurrence(daily, { now })?.toISOString(),
        ).toBe(
            getPreviousRecurrenceOccurrence(daily, {
                now,
                includeNow: false,
            })?.toISOString(),
        );
        expect(
            getPreviousRecurrenceOccurrence(
                { ...daily, timeZone: "UTC" },
                { now },
            )?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
    });

    it("keeps 09:00 wall time across the New York spring-forward", () => {
        expect(
            getPreviousRecurrenceOccurrence(
                {
                    start: new Date("2024-03-09T14:00:00.000Z"),
                    frequency: "daily",
                    timeZone: "America/New_York",
                },
                { now: "2024-03-11T13:00:00Z" },
            )?.toISOString(),
        ).toBe("2024-03-10T13:00:00.000Z");
    });
});
