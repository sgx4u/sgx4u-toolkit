import { describe, expect, it } from "vitest";
import { getNextBusinessHoursStart } from "../index.js";

describe("getNextBusinessHoursStart", () => {
    it("returns the instant when it is open and otherwise the next 09:00", () => {
        expect(
            getNextBusinessHoursStart({
                date: "2026-11-26T08:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getNextBusinessHoursStart({
                date: "2026-11-26T12:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-26T12:00:00.000Z");
        expect(
            getNextBusinessHoursStart({
                date: "2026-11-26T17:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
        expect(
            getNextBusinessHoursStart({
                date: "2026-11-26T18:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
    });

    it("skips the weekend at a month end and a Friday evening", () => {
        expect(
            getNextBusinessHoursStart({
                date: "2026-11-27T18:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-30T09:00:00.000Z");
        expect(
            getNextBusinessHoursStart({
                date: "2026-01-30T18:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-02-02T09:00:00.000Z");
    });

    it("opens at 09:00 local time in New York daylight time and in Kolkata", () => {
        expect(
            getNextBusinessHoursStart({
                date: "2026-03-09T12:00:00Z",
                ...{
                    timeZone: "America/New_York",
                },
            })?.toISOString(),
        ).toBe("2026-03-09T13:00:00.000Z");
        expect(
            getNextBusinessHoursStart({
                date: "2026-07-01T14:00:00Z",
                ...{
                    timeZone: "America/New_York",
                },
            })?.toISOString(),
        ).toBe("2026-07-01T14:00:00.000Z");
        expect(
            getNextBusinessHoursStart({
                date: "2026-11-26T02:30:00Z",
                ...{
                    timeZone: "Asia/Kolkata",
                },
            })?.toISOString(),
        ).toBe("2026-11-26T03:30:00.000Z");
    });

    it("throws when the date is invalid or the calendar never opens", () => {
        expect(
            getNextBusinessHoursStart({ date: "nope", ...{ timeZone: "UTC" } }),
        ).toBeUndefined();
        expect(() =>
            getNextBusinessHoursStart({
                date: "2026-01-01T00:00:00Z",
                ...{
                    timeZone: "UTC",
                    workingDays: [],
                },
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextBusinessHoursStart({
                date: "2026-01-01T00:00:00Z",
                ...{
                    timeZone: "UTC",
                    workingDays: [],
                },
            }),
        ).toThrow("3660 consecutive non-business days");
    });
});
