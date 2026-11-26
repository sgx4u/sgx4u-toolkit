import { describe, expect, it } from "vitest";
import { millisecondsToDuration } from "../index.js";

describe("millisecondsToDuration", () => {
    it("splits a length into days and clock fields by default", () => {
        expect(millisecondsToDuration(5_400_000)).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(millisecondsToDuration(90_061_001)).toEqual({
            days: 1,
            hours: 1,
            minutes: 1,
            seconds: 1,
            milliseconds: 1,
        });
        expect(millisecondsToDuration(86_400_000)).toEqual({ days: 1 });
        expect(millisecondsToDuration(0)).toEqual({});
        expect(millisecondsToDuration(-5_400_000)).toEqual({
            hours: -1,
            minutes: -30,
        });
        expect(millisecondsToDuration(1_500.5)).toEqual({
            seconds: 1,
            milliseconds: 500.5,
        });
    });

    it("honors the largest and smallest units", () => {
        expect(
            millisecondsToDuration(8 * 86_400_000, { largestUnit: "week" }),
        ).toEqual({ weeks: 1, days: 1 });
        expect(
            millisecondsToDuration(6 * 86_400_000, { largestUnit: "week" }),
        ).toEqual({ days: 6 });
        expect(
            millisecondsToDuration(-8 * 86_400_000, { largestUnit: "week" }),
        ).toEqual({ weeks: -1, days: -1 });
        expect(
            millisecondsToDuration(1_500, {
                largestUnit: "second",
                smallestUnit: "second",
            }),
        ).toEqual({ seconds: 1.5 });
        expect(
            millisecondsToDuration(5_400_000, {
                largestUnit: "hour",
                smallestUnit: "hour",
            }),
        ).toEqual({ hours: 1.5 });
        expect(
            millisecondsToDuration(90_000, { smallestUnit: "minute" }),
        ).toEqual({ minutes: 1.5 });
    });

    it("throws when a unit is unknown, out of order, or the length is not finite", () => {
        expect(() =>
            millisecondsToDuration(1_000, {
                largestUnit: "second",
                smallestUnit: "minute",
            }),
        ).toThrow(RangeError);
        expect(() =>
            millisecondsToDuration(1_000, {
                largestUnit: "month" as "day",
            }),
        ).toThrow(RangeError);
        expect(() =>
            millisecondsToDuration(1_000, {
                smallestUnit: "year" as "second",
            }),
        ).toThrow(RangeError);
        expect(() => millisecondsToDuration(Number.NaN)).toThrow(RangeError);
        expect(() => millisecondsToDuration(Number.POSITIVE_INFINITY)).toThrow(
            RangeError,
        );
        expect(() =>
            millisecondsToDuration("1000" as unknown as number),
        ).toThrow(TypeError);
    });
});
