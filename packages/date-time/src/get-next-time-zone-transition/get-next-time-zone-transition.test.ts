import { describe, expect, it } from "vitest";
import { getNextTimeZoneTransition } from "../index.js";

describe("getNextTimeZoneTransition", () => {
    it("returns the 2024 New York spring-forward", () => {
        const transition = getNextTimeZoneTransition(
            "2024-03-10T00:00:00Z",
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
            getNextTimeZoneTransition(
                "2024-03-10T07:00:00.000Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2024-11-03T06:00:00.000Z");
        expect(
            getNextTimeZoneTransition(
                "2024-03-10T06:59:59.998Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2024-03-10T07:00:00.000Z");
        expect(
            getNextTimeZoneTransition(
                "2024-03-10T06:59:59.999Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2024-11-03T06:00:00.000Z");
        expect(
            getNextTimeZoneTransition("2026-01-15T00:00:00Z", "UTC"),
        ).toBeUndefined();
        expect(
            getNextTimeZoneTransition("2026-07-15T00:00:00Z", "+05:30"),
        ).toBeUndefined();
    });

    it("rejects an unknown zone or a date that is not real", () => {
        expect(() =>
            getNextTimeZoneTransition("2026-01-15T00:00:00Z", "Mars/Base"),
        ).toThrow(RangeError);
        expect(() =>
            getNextTimeZoneTransition("2026-01-15T00:00:00Z", "Mars/Base"),
        ).toThrow("`timeZone`");
        expect(() =>
            getNextTimeZoneTransition("2026-01-15T00:00:00Z", 5 as never),
        ).toThrow(TypeError);
        expect(() =>
            getNextTimeZoneTransition("2026-01-15T00:00:00Z", 5 as never),
        ).toThrow("`timeZone`");
        expect(() =>
            getNextTimeZoneTransition("nope", "America/New_York"),
        ).toThrow("`date`");
    });
});
