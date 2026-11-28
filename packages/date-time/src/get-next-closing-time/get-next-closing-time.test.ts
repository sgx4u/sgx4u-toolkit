import { describe, expect, it } from "vitest";
import { getNextClosingTime } from "../index.js";

const thursday = {
    hours: { 4: [{ start: "09:00", end: "17:00" }] },
} as const;

describe("getNextClosingTime", () => {
    it("closes the current open interval and the next one when shut", () => {
        expect(
            getNextClosingTime({
                date: "2026-11-26T12:00:00Z",
                schedule: thursday,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T17:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-11-25T12:00:00Z",
                schedule: thursday,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T17:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-11-26T17:00:00Z",
                schedule: thursday,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-12-03T17:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-11-26T23:00:00Z",
                schedule: { hours: { 4: [{ start: "22:00", end: "02:00" }] } },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-27T02:00:00.000Z");
    });

    it("skips a closure and a year-end Thursday still closes that day", () => {
        expect(
            getNextClosingTime({
                date: "2026-11-25T12:00:00Z",
                schedule: {
                    ...thursday,
                    closures: [{ year: 2026, month: 11, day: 26 }],
                },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-12-03T17:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-12-31T12:00:00Z",
                schedule: thursday,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-12-31T17:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-11-26T12:00:00Z",
                schedule: { hours: {} },
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });

    it("closes at local time through the New York spring-forward and in Kolkata", () => {
        expect(
            getNextClosingTime({
                date: "2026-03-08T05:30:00Z",
                schedule: { hours: { 7: [{ start: "01:00", end: "04:00" }] } },
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2026-03-08T08:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-11-26T06:00:00Z",
                schedule: thursday,
                timeZone: "Asia/Kolkata",
            })?.toISOString(),
        ).toBe("2026-11-26T11:30:00.000Z");
    });

    it("throws for a bad date or a range that is not a time of day", () => {
        expect(() =>
            getNextClosingTime({
                date: "nope",
                schedule: thursday,
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextClosingTime({
                date: "nope",
                schedule: thursday,
                timeZone: "UTC",
            }),
        ).toThrow('`date` must be a valid date; received "nope".');
        expect(() =>
            getNextClosingTime({
                date: "2026-11-26T12:00:00Z",
                schedule: { hours: { 4: [{ start: "25:00", end: "17:00" }] } },
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextClosingTime({
                date: "2026-11-26T12:00:00Z",
                schedule: { hours: { 4: [{ start: "25:00", end: "17:00" }] } },
                timeZone: "UTC",
            }),
        ).toThrow("`schedule.hours` must be time ranges");
    });
});
