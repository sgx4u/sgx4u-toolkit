import { describe, expect, it } from "vitest";
import {
    getIntervalDuration,
    listDatesInInterval,
    roundDuration,
    splitInterval,
} from "../index.js";

describe("duration rounding and interval stepping", () => {
    it("rounds 90 minutes to 2 hours and splits ten milliseconds into three pieces", () => {
        expect(
            roundDuration({
                duration: { minutes: 90 },
                smallestUnit: "hour",
            }),
        ).toEqual({
            hours: 2,
        });
        expect(
            roundDuration({
                duration: { minutes: 20 },
                smallestUnit: "hour",
                mode: "down",
            }),
        ).toEqual({});
        const pieces = splitInterval({
            start: new Date(0),
            end: new Date(10),
            step: { milliseconds: 4 },
        });
        expect(pieces).toEqual([
            { start: new Date(0), end: new Date(4) },
            { start: new Date(4), end: new Date(8) },
            { start: new Date(8), end: new Date(10) },
        ]);
        expect(
            getIntervalDuration({
                start: new Date(0),
                end: new Date(90 * 60 * 1000),
            }),
        ).toEqual({ hours: 1, minutes: 30 });
        expect(
            listDatesInInterval({
                start: new Date("2026-01-01T00:00:00Z"),
                end: new Date("2026-01-03T00:00:00Z"),
                timeZone: "UTC",
            })?.map((date) => date.toISOString()),
        ).toEqual(["2026-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z"]);
        expect(() =>
            splitInterval({
                start: new Date(0),
                end: new Date(10),
                step: { milliseconds: 0 },
            }),
        ).toThrow(RangeError);
    });
});