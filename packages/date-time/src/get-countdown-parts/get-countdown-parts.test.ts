import { describe, expect, it } from "vitest";
import { getCountdownParts } from "../index.js";

describe("getCountdownParts", () => {
    it("splits a remaining span from days by default", () => {
        expect(
            getCountdownParts("2026-01-02T01:02:03.004Z", {
                now: "2026-01-01T00:00:00Z",
            }),
        ).toEqual({
            days: 1,
            hours: 1,
            minutes: 2,
            seconds: 3,
            milliseconds: 4,
            totalMilliseconds: 90_123_004,
            isComplete: false,
        });
        expect(
            getCountdownParts("2026-01-01T01:00:00Z", {
                now: "2026-01-01T00:00:00Z",
                largestUnit: "hour",
            }).hours,
        ).toBe(1);
        expect(
            getCountdownParts("2026-01-01T01:00:00Z", {
                now: "2026-01-01T00:00:00Z",
            }).days,
        ).toBe(0);
    });

    it("counts the leap day as 24 hours and rolls into the next year", () => {
        expect(
            getCountdownParts("2024-03-01T00:00:00Z", {
                now: "2024-02-28T00:00:00Z",
            }),
        ).toMatchObject({ days: 2, totalMilliseconds: 172_800_000 });
        expect(
            getCountdownParts("2023-03-01T00:00:00Z", {
                now: "2023-02-28T00:00:00Z",
            }),
        ).toMatchObject({ days: 1, totalMilliseconds: 86_400_000 });
        expect(
            getCountdownParts("2027-01-01T01:30:00Z", {
                now: "2026-12-31T22:00:00Z",
            }),
        ).toMatchObject({
            days: 0,
            hours: 3,
            minutes: 30,
            totalMilliseconds: 12_600_000,
            isComplete: false,
        });
    });

    it("is complete, and never negative, once the target is not after now", () => {
        expect(
            getCountdownParts("2026-01-01T00:00:00Z", {
                now: "2026-01-01T00:00:00Z",
            }),
        ).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            totalMilliseconds: 0,
            isComplete: true,
        });
        expect(
            getCountdownParts("2020-01-01T00:00:00Z", {
                now: "2026-01-01T00:00:00Z",
            }).isComplete,
        ).toBe(true);
    });

    it("throws for an unknown largest unit or a target that is not a date", () => {
        expect(() =>
            getCountdownParts("2026-01-01T00:00:00Z", {
                now: "2026-01-01T00:00:00Z",
                largestUnit: "week" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getCountdownParts("2026-01-01T00:00:00Z", {
                now: "2026-01-01T00:00:00Z",
                largestUnit: "week" as never,
            }),
        ).toThrow('"day", "hour", "minute", or "second"');
        expect(() => getCountdownParts("nope", { now: 0 })).toThrow(RangeError);
        expect(() => getCountdownParts("nope", { now: 0 })).toThrow(
            '`target` must be a valid date; received "nope".',
        );
        expect(() => getCountdownParts(null as never, { now: 0 })).toThrow(
            TypeError,
        );
    });
});
