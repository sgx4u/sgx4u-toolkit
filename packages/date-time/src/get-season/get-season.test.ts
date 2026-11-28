import { describe, expect, it } from "vitest";
import {
    addDurations,
    formatUTCOffset,
    getSeason,
    listTimeZones,
    negateDuration,
    parseUTCOffset,
} from "../index.js";

describe("seasons, offsets, and duration sums", () => {
    it("names meteorological seasons and formats offsets", () => {
        expect(
            getSeason({ date: "2026-07-01T00:00:00Z", timeZone: "UTC" }),
        ).toBe("summer");
        expect(
            getSeason({
                date: "2026-07-01T00:00:00Z",
                timeZone: "UTC",
                hemisphere: "southern",
            }),
        ).toBe("winter");
        expect(formatUTCOffset({ offsetMinutes: 330 })).toBe("+05:30");
        expect(formatUTCOffset({ offsetMinutes: 330, style: "basic" })).toBe(
            "+0530",
        );
        expect(formatUTCOffset({ offsetMinutes: 0, useZForZero: true })).toBe(
            "Z",
        );
        expect(parseUTCOffset("+05:30")).toBe(330);
        expect(parseUTCOffset("Z")).toBe(0);
        expect(listTimeZones().includes("Africa/Abidjan")).toBe(true);
        expect(negateDuration({ hours: 2 })).toEqual({ hours: -2 });
        expect(
            addDurations({ first: { hours: 1 }, second: { minutes: 30 } }),
        ).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(() =>
            addDurations({ first: { hours: 1 }, second: { days: -1 } }),
        ).toThrow(RangeError);
    });
});
