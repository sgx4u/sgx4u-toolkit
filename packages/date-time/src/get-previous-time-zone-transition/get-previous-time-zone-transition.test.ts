import { describe, expect, it } from "vitest";
import { getPreviousTimeZoneTransition } from "../index.js";

describe("getPreviousTimeZoneTransition", () => {
    it("returns the 2024 New York spring-forward", () => {
        const transition = getPreviousTimeZoneTransition({
            date: "2024-03-11T00:00:00Z",
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
            getPreviousTimeZoneTransition({
                date: "2024-03-10T07:00:00.000Z",
                timeZone: "America/New_York",
            })?.instant.toISOString(),
        ).toBe("2023-11-05T06:00:00.000Z");
        expect(
            getPreviousTimeZoneTransition({
                date: "2024-03-10T07:00:00.001Z",
                timeZone: "America/New_York",
            })?.instant.toISOString(),
        ).toBe("2024-03-10T07:00:00.000Z");
        expect(
            getPreviousTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(
            getPreviousTimeZoneTransition({
                date: "2026-07-15T00:00:00Z",
                timeZone: "+05:30",
            }),
        ).toBeUndefined();
    });

    it("rejects an unknown zone or a date that is not real", () => {
        expect(() =>
            getPreviousTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getPreviousTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow("`timeZone`");
        expect(() =>
            getPreviousTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: 5 as never,
            }),
        ).toThrow(TypeError);
        expect(() =>
            getPreviousTimeZoneTransition({
                date: "2026-01-15T00:00:00Z",
                timeZone: 5 as never,
            }),
        ).toThrow("`timeZone`");
        expect(() =>
            getPreviousTimeZoneTransition({
                date: "nope",
                timeZone: "America/New_York",
            }),
        ).toThrow("`date`");
    });
});
