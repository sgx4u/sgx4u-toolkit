import { describe, expect, it } from "vitest";
import { normalizeDuration } from "../index.js";

describe("normalizeDuration", () => {
    it("carries 90 minutes into 1 hour and 30 minutes", () => {
        expect(normalizeDuration({ duration: { minutes: 90 } })).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(normalizeDuration({ duration: { hours: 26 } })).toEqual({
            days: 1,
            hours: 2,
        });
        expect(
            normalizeDuration({ duration: { months: 1, minutes: 90 } })?.months,
        ).toBe(1);
        expect(
            normalizeDuration({
                duration: { months: 1, days: 40 },
                relativeTo: "2026-01-31T00:00:00Z",
                timeZone: "UTC",
                largestUnit: "year",
            }),
        ).toEqual({ months: 2, weeks: 1, days: 2 });
    });
});
