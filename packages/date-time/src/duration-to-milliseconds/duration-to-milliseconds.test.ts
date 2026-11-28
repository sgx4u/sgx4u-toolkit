import { describe, expect, it } from "vitest";
import {
    compareDurations,
    durationToMilliseconds,
    millisecondsToDuration,
} from "../index.js";

describe("duration lengths", () => {
    it("converts clock durations and compares them", () => {
        expect(
            durationToMilliseconds({ duration: { hours: 1, minutes: 30 } }),
        ).toBe(5_400_000);
        expect(millisecondsToDuration({ milliseconds: 5_400_000 })).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(
            compareDurations({ first: { hours: 2 }, second: { minutes: 90 } }),
        ).toBe(1);
        expect(() =>
            durationToMilliseconds({ duration: { months: 1 } }),
        ).toThrow(RangeError);
        expect(
            durationToMilliseconds({
                duration: { months: 1 },
                relativeTo: "2026-01-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(
            Date.parse("2026-02-28T00:00:00Z") -
                Date.parse("2026-01-31T00:00:00Z"),
        );
    });

    it("returns undefined for an invalid duration", () => {
        expect(
            durationToMilliseconds({ duration: { hours: 1, minutes: -1 } }),
        ).toBeUndefined();
    });
});
