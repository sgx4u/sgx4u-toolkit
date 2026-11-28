import { describe, expect, it } from "vitest";
import { getTimeZoneTransitions } from "../index.js";

const springDay = {
    start: new Date("2024-03-10T00:00:00.000Z"),
    end: new Date("2024-03-11T00:00:00.000Z"),
};

describe("getTimeZoneTransitions", () => {
    it("returns the 2024 New York spring-forward", () => {
        const transitions = getTimeZoneTransitions({
            interval: springDay,
            timeZone: "America/New_York",
        });
        expect(transitions)?.toHaveLength(1);
        expect(transitions[0]?.instant.toISOString()).toBe(
            "2024-03-10T07:00:00.000Z",
        );
        expect(transitions[0]?.offsetMinutesBefore).toBe(-300);
        expect(transitions[0]?.offsetMinutesAfter).toBe(-240);
    });

    it("excludes a transition at the end and an empty or fixed-offset window", () => {
        expect(
            getTimeZoneTransitions({
                interval: {
                    start: new Date("2024-03-10T00:00:00.000Z"),
                    end: new Date("2024-03-10T07:00:00.000Z"),
                },
                timeZone: "America/New_York",
            }),
        ).toEqual([]);
        expect(
            getTimeZoneTransitions({
                interval: {
                    start: new Date("2024-03-10T07:00:00.000Z"),
                    end: new Date("2024-03-10T07:00:00.000Z"),
                },
                timeZone: "America/New_York",
            }),
        ).toEqual([]);
        expect(
            getTimeZoneTransitions({ interval: springDay, timeZone: "UTC" }),
        ).toEqual([]);
        expect(
            getTimeZoneTransitions({ interval: springDay, timeZone: "+05:30" }),
        ).toEqual([]);
    });

    it("rejects a span longer than 50 years or an unknown zone", () => {
        const start = new Date("2000-01-01T00:00:00.000Z");
        const end = new Date(start.getTime() + 50 * 365.25 * 86_400_000 + 1);
        expect(() =>
            getTimeZoneTransitions({
                interval: { start, end },
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getTimeZoneTransitions({
                interval: { start, end },
                timeZone: "UTC",
            }),
        ).toThrow("`interval`");
        expect(() =>
            getTimeZoneTransitions({
                interval: {
                    start: new Date("2024-03-11T00:00:00Z"),
                    end: new Date("2024-03-10T00:00:00Z"),
                },
                timeZone: "UTC",
            }),
        ).toThrow("`interval`");
        expect(() =>
            getTimeZoneTransitions({
                interval: springDay,
                timeZone: "Mars/Base",
            }),
        ).toThrow("`timeZone`");
        expect(() =>
            getTimeZoneTransitions({
                interval: null as never,
                timeZone: "UTC",
            }),
        ).toThrow(TypeError);
        expect(() =>
            getTimeZoneTransitions({
                interval: null as never,
                timeZone: "UTC",
            }),
        ).toThrow("`interval`");
    });

    it("includes a span of exactly 50 years", () => {
        const start = new Date("2000-01-01T00:00:00.000Z");
        const end = new Date(start.getTime() + 50 * 365.25 * 86_400_000);
        // `+00:00` skips Intl. A 50-year UTC scan exceeds 5s in parallel CI.
        const transitions = getTimeZoneTransitions({
            interval: { start, end },
            timeZone: "+00:00",
        });
        expect(transitions).toEqual([]);
    });

    it("finds both 2024 New York offset changes", () => {
        const transitions = getTimeZoneTransitions({
            interval: {
                start: new Date("2024-01-01T00:00:00.000Z"),
                end: new Date("2025-01-01T00:00:00.000Z"),
            },
            timeZone: "America/New_York",
        });
        expect(
            transitions.map((transition) => transition.instant.toISOString()),
        ).toEqual(["2024-03-10T07:00:00.000Z", "2024-11-03T06:00:00.000Z"]);
        expect(transitions[1]?.offsetMinutesBefore).toBe(-240);
        expect(transitions[1]?.offsetMinutesAfter).toBe(-300);
    });
});
