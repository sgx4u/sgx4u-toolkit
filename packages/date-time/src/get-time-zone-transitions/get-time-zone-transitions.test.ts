import { describe, expect, it } from "vitest";
import { getTimeZoneTransitions } from "../index.js";

const springDay = {
    start: new Date("2024-03-10T00:00:00.000Z"),
    end: new Date("2024-03-11T00:00:00.000Z"),
};

describe("getTimeZoneTransitions", () => {
    it("returns the 2024 New York spring-forward", () => {
        const transitions = getTimeZoneTransitions(
            springDay,
            "America/New_York",
        );
        expect(transitions).toHaveLength(1);
        expect(transitions[0]?.instant.toISOString()).toBe(
            "2024-03-10T07:00:00.000Z",
        );
        expect(transitions[0]?.offsetMinutesBefore).toBe(-300);
        expect(transitions[0]?.offsetMinutesAfter).toBe(-240);
    });

    it("excludes a transition at the end and an empty or fixed-offset window", () => {
        expect(
            getTimeZoneTransitions(
                {
                    start: new Date("2024-03-10T00:00:00.000Z"),
                    end: new Date("2024-03-10T07:00:00.000Z"),
                },
                "America/New_York",
            ),
        ).toEqual([]);
        expect(
            getTimeZoneTransitions(
                {
                    start: new Date("2024-03-10T07:00:00.000Z"),
                    end: new Date("2024-03-10T07:00:00.000Z"),
                },
                "America/New_York",
            ),
        ).toEqual([]);
        expect(getTimeZoneTransitions(springDay, "UTC")).toEqual([]);
        expect(getTimeZoneTransitions(springDay, "+05:30")).toEqual([]);
    });

    it("rejects a span longer than 50 years or an unknown zone", () => {
        const start = new Date("2000-01-01T00:00:00.000Z");
        const end = new Date(start.getTime() + 50 * 365.25 * 86_400_000 + 1);
        expect(() => getTimeZoneTransitions({ start, end }, "UTC")).toThrow(
            RangeError,
        );
        expect(() => getTimeZoneTransitions({ start, end }, "UTC")).toThrow(
            "`interval`",
        );
        expect(() =>
            getTimeZoneTransitions(
                {
                    start: new Date("2024-03-11T00:00:00Z"),
                    end: new Date("2024-03-10T00:00:00Z"),
                },
                "UTC",
            ),
        ).toThrow("`interval`");
        expect(() => getTimeZoneTransitions(springDay, "Mars/Base")).toThrow(
            "`timeZone`",
        );
        expect(() => getTimeZoneTransitions(null as never, "UTC")).toThrow(
            TypeError,
        );
        expect(() => getTimeZoneTransitions(null as never, "UTC")).toThrow(
            "`interval`",
        );
    });

    it("includes a span of exactly 50 years", () => {
        const start = new Date("2000-01-01T00:00:00.000Z");
        const end = new Date(start.getTime() + 50 * 365.25 * 86_400_000);
        expect(() =>
            getTimeZoneTransitions({ start, end }, "UTC"),
        ).not.toThrow();
        expect(getTimeZoneTransitions({ start, end }, "UTC")).toEqual([]);
    });

    it("finds both 2024 New York offset changes", () => {
        const transitions = getTimeZoneTransitions(
            {
                start: new Date("2024-01-01T00:00:00.000Z"),
                end: new Date("2025-01-01T00:00:00.000Z"),
            },
            "America/New_York",
        );
        expect(
            transitions.map((transition) => transition.instant.toISOString()),
        ).toEqual(["2024-03-10T07:00:00.000Z", "2024-11-03T06:00:00.000Z"]);
        expect(transitions[1]?.offsetMinutesBefore).toBe(-240);
        expect(transitions[1]?.offsetMinutesAfter).toBe(-300);
    });
});
