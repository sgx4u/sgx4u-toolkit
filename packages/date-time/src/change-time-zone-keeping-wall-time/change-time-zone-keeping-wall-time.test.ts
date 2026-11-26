import { describe, expect, it } from "vitest";
import {
    addToTimeOfDay,
    changeTimeZoneKeepingWallTime,
    formatTimeOfDay,
    getTimeZoneDifference,
    isDaylightSavingTime,
} from "../index.js";

describe("time zone moves and times of day", () => {
    it("keeps a wall clock, names daylight saving, and wraps past midnight", () => {
        expect(
            changeTimeZoneKeepingWallTime({
                date: "2026-11-26T03:30:00+05:30",
                fromTimeZone: "Asia/Kolkata",
                toTimeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T03:30:00.000Z");
        expect(
            getTimeZoneDifference("Asia/Kolkata", "UTC", {
                at: "2026-01-01T00:00:00Z",
            }),
        ).toBe(330);
        expect(
            isDaylightSavingTime("2026-01-15T17:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isDaylightSavingTime("2026-07-15T16:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            addToTimeOfDay({
                time: { hour: 23, minute: 30, second: 0, millisecond: 0 },
                duration: { hours: 2 },
            }),
        ).toEqual({
            time: { hour: 1, minute: 30, second: 0, millisecond: 0 },
            dayOffset: 1,
        });
        expect(
            formatTimeOfDay(
                { hour: 15, minute: 30, second: 0, millisecond: 0 },
                { locale: "en-US", hourCycle: "h23" },
            ),
        ).toBe("15:30");
    });

    it("returns undefined for a bad date", () => {
        expect(
            changeTimeZoneKeepingWallTime({
                date: "nope",
                fromTimeZone: "UTC",
                toTimeZone: "Asia/Kolkata",
            }),
        ).toBeUndefined();
    });
});