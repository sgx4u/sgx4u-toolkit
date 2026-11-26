import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getNextOpeningTime } from "../index.js";

const thursdayHours = {
    hours: { 4: [{ start: "09:00", end: "17:00" }] },
};

describe("getNextOpeningTime", () => {
    it("returns the next Thursday opening", () => {
        expect(
            getNextOpeningTime("2026-11-26T08:00:00Z", thursdayHours, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
    });

    it("keeps an opening that starts now and skips a time already inside the range", () => {
        expect(
            getNextOpeningTime("2026-11-26T09:00:00.000Z", thursdayHours, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getNextOpeningTime("2026-11-26T09:00:00.001Z", thursdayHours, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-12-03T09:00:00.000Z");
        expect(
            getNextOpeningTime("2026-11-26T17:00:00.000Z", thursdayHours, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-12-03T09:00:00.000Z");
        expect(
            getNextOpeningTime(
                "2026-11-25T12:00:00Z",
                {
                    ...thursdayHours,
                    closures: [{ year: 2026, month: 11, day: 26 }],
                },
                { timeZone: "UTC" },
            )?.toISOString(),
        ).toBe("2026-12-03T09:00:00.000Z");
        expect(
            getNextOpeningTime(
                "2026-11-26T21:00:00Z",
                { hours: { 4: [{ start: "22:00", end: "02:00" }] } },
                { timeZone: "UTC" },
            )?.toISOString(),
        ).toBe("2026-11-26T22:00:00.000Z");
        expect(
            getNextOpeningTime(
                "2026-11-26T12:00:00Z",
                { hours: {} },
                {
                    timeZone: "UTC",
                },
            ),
        ).toBeUndefined();
    });

    it("rejects a date or a range that is not real", () => {
        expect(() =>
            getNextOpeningTime("nope", thursdayHours, { timeZone: "UTC" }),
        ).toThrow(RangeError);
        expect(() =>
            getNextOpeningTime("nope", thursdayHours, { timeZone: "UTC" }),
        ).toThrow("`date`");
        expect(() =>
            getNextOpeningTime(null, thursdayHours, { timeZone: "UTC" }),
        ).toThrow(TypeError);
        expect(() =>
            getNextOpeningTime(null, thursdayHours, { timeZone: "UTC" }),
        ).toThrow("`date`");
        expect(() =>
            getNextOpeningTime(
                "2026-11-26T08:00:00Z",
                { hours: { 4: [{ start: "25:00", end: "26:00" }] } },
                { timeZone: "UTC" },
            ),
        ).toThrow("`schedule.hours`");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-26T12:00:00Z";
        expect(getNextOpeningTime(date, thursdayHours)?.toISOString()).toBe(
            getNextOpeningTime(date, thursdayHours, {
                timeZone: getLocalTimeZone(),
            })?.toISOString(),
        );
    });

    it("reads 09:00 in New York as 13:00 UTC in July and 14:00 UTC in November", () => {
        expect(
            getNextOpeningTime("2026-07-16T12:00:00Z", thursdayHours, {
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2026-07-16T13:00:00.000Z");
        expect(
            getNextOpeningTime("2026-11-26T13:00:00Z", thursdayHours, {
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2026-11-26T14:00:00.000Z");
    });
});
