import { describe, expect, it } from "vitest";
import { getPreviousTimeZoneTransition } from "../index.js";

describe("getPreviousTimeZoneTransition", () => {
    it("returns the 2024 New York spring-forward", () => {
        const transition = getPreviousTimeZoneTransition(
            "2024-03-11T00:00:00Z",
            "America/New_York",
        );
        expect(transition?.instant.toISOString()).toBe(
            "2024-03-10T07:00:00.000Z",
        );
        expect(transition?.offsetMinutesBefore).toBe(-300);
        expect(transition?.offsetMinutesAfter).toBe(-240);
    });

    it("skips a transition at the exact instant and finds none for a fixed offset", () => {
        expect(
            getPreviousTimeZoneTransition(
                "2024-03-10T07:00:00.000Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2023-11-05T06:00:00.000Z");
        expect(
            getPreviousTimeZoneTransition(
                "2024-03-10T07:00:00.001Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2024-03-10T07:00:00.000Z");
        expect(
            getPreviousTimeZoneTransition("2026-01-15T00:00:00Z", "UTC"),
        ).toBeUndefined();
        expect(
            getPreviousTimeZoneTransition("2026-07-15T00:00:00Z", "+05:30"),
        ).toBeUndefined();
    });

    it("rejects an unknown zone or a date that is not real", () => {
        expect(() =>
            getPreviousTimeZoneTransition("2026-01-15T00:00:00Z", "Mars/Base"),
        ).toThrow(RangeError);
        expect(() =>
            getPreviousTimeZoneTransition("2026-01-15T00:00:00Z", "Mars/Base"),
        ).toThrow("`timeZone`");
        expect(() =>
            getPreviousTimeZoneTransition("2026-01-15T00:00:00Z", 5),
        ).toThrow(TypeError);
        expect(() =>
            getPreviousTimeZoneTransition("2026-01-15T00:00:00Z", 5),
        ).toThrow("`timeZone`");
        expect(() =>
            getPreviousTimeZoneTransition("nope", "America/New_York"),
        ).toThrow("`date`");
    });
});
