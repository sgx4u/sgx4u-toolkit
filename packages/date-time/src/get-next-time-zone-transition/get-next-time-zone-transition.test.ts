import { describe, expect, it } from "vitest";
import { getNextTimeZoneTransition } from "../index.js";

describe("getNextTimeZoneTransition", () => {
    it("returns the 2024 New York spring-forward", () => {
        const transition = getNextTimeZoneTransition({
            date: "2024-03-10T00:00:00Z",
            timeZone: "America/New_York",
        });
        expect(transition?.instant.toISOString()).toBe(
            "2024-03-10T07:00:00.000Z",
        );
        expect(transition?.offsetMinutesBefore).toBe(-300);
        expect(transition?.offsetMinutesAfter).toBe(-240);
    });

    it("skips a transition at the exact instant and finds none for a fixed offset", () => {
        expect(
            getNextTimeZoneTransition({
                date: "2024-03-10T07:00:00.000Z",
                timeZone: "America/New_York",
            })?.instant.toISOString(),
        ).toBe("2024-11-03T06:00:00.000Z");
        expect(
            getNextTimeZoneTransition({
                date: "2024-03-10T06:59:59.998Z",
                timeZone: "America/New_York",
            })?.instant.toISOString(),
        ).toBe("2024-03-10T07:00:00.000Z");
        expect(
            getNextTimeZoneTransition({
                date: "2024-03-10T06:59:59.999Z",
                timeZone: "America/New_York",
            })?.instant.toISOString(),
        ).toBe("2024-11-03T06:00:00.000Z");
        expect(
            getNextTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(
            getNextTimeZoneTransition({
                date: "2026-07-15T00:00:00Z",
                timeZone: "+05:30",
            }),
        ).toBeUndefined();
    });

    it("rejects an unknown zone or a date that is not real", () => {
        expect(() =>
            getNextTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow("`timeZone`");
        expect(() =>
            getNextTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: 5 as never,
            }),
        ).toThrow(TypeError);
        expect(() =>
            getNextTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: 5 as never,
            }),
        ).toThrow("`timeZone`");
        expect(() =>
            getNextTimeZoneTransition({
                date: "nope",
                timeZone: "America/New_York",
            }),
        ).toThrow("`date`");
    });
});
