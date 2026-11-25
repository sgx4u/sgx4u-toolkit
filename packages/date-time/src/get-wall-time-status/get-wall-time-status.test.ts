import { describe, expect, it } from "vitest";
import {
    getNextTimeZoneTransition,
    getPreviousTimeZoneTransition,
    getTimeZoneTransitions,
    getWallTimeStatus,
} from "../index.js";

describe("time zone transitions", () => {
    it("finds the 2024 New York spring-forward and a skipped wall time", () => {
        expect(
            getWallTimeStatus(
                { year: 2024, month: 3, day: 10, hour: 2, minute: 30 },
                "America/New_York",
            ),
        ).toBe("skipped");
        expect(
            getWallTimeStatus(
                { year: 2024, month: 11, day: 3, hour: 1, minute: 30 },
                "America/New_York",
            ),
        ).toBe("repeated");
        expect(
            getWallTimeStatus(
                { year: 2024, month: 6, day: 15, hour: 12 },
                "America/New_York",
            ),
        ).toBe("valid");
        const transitions = getTimeZoneTransitions(
            {
                start: new Date("2024-03-10T00:00:00Z"),
                end: new Date("2024-03-11T00:00:00Z"),
            },
            "America/New_York",
        );
        expect(transitions[0]?.instant.toISOString()).toBe(
            "2024-03-10T07:00:00.000Z",
        );
        expect(transitions[0]?.offsetMinutesBefore).toBe(-300);
        expect(transitions[0]?.offsetMinutesAfter).toBe(-240);
        expect(
            getNextTimeZoneTransition(
                "2024-03-10T00:00:00Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2024-03-10T07:00:00.000Z");
        expect(
            getPreviousTimeZoneTransition(
                "2024-03-11T00:00:00Z",
                "America/New_York",
            )?.instant.toISOString(),
        ).toBe("2024-03-10T07:00:00.000Z");
        expect(
            getNextTimeZoneTransition("2026-06-01T00:00:00Z", "Asia/Kolkata"),
        ).toBeUndefined();
    });
});
