import { describe, expect, it } from "vitest";
import { getNextBusinessDay } from "../index.js";

describe("getNextBusinessDay", () => {
    it("skips the current day and lands on the next weekday", () => {
        expect(
            getNextBusinessDay({
                date: "2026-11-26T15:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-27T00:00:00.000Z");
        expect(
            getNextBusinessDay({
                date: "2026-11-27T15:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-30T00:00:00.000Z");
        expect(
            getNextBusinessDay({
                date: "2026-11-28T15:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-11-30T00:00:00.000Z");
    });

    it("skips a holiday, a month end, and a year end", () => {
        expect(
            getNextBusinessDay({
                date: "2026-11-26T15:00:00Z",
                ...{
                    timeZone: "UTC",
                    holidays: ["2026-11-27"],
                },
            })?.toISOString(),
        ).toBe("2026-11-30T00:00:00.000Z");
        expect(
            getNextBusinessDay({
                date: "2026-01-30T12:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2026-02-02T00:00:00.000Z");
        expect(
            getNextBusinessDay({
                date: "2021-12-31T12:00:00Z",
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe("2022-01-03T00:00:00.000Z");
    });

    it("uses local midnight after the New York spring-forward and in Kolkata", () => {
        expect(
            getNextBusinessDay({
                date: "2026-03-06T15:00:00Z",
                ...{
                    timeZone: "America/New_York",
                },
            })?.toISOString(),
        ).toBe("2026-03-09T04:00:00.000Z");
        expect(
            getNextBusinessDay({
                date: "2026-11-27T09:30:00Z",
                ...{
                    timeZone: "Asia/Kolkata",
                },
            })?.toISOString(),
        ).toBe("2026-11-29T18:30:00.000Z");
    });

    it("throws when no business day exists or the date is invalid", () => {
        expect(() =>
            getNextBusinessDay({
                date: "2026-01-01T00:00:00Z",
                ...{
                    timeZone: "UTC",
                    workingDays: [],
                },
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextBusinessDay({
                date: "2026-01-01T00:00:00Z",
                ...{
                    timeZone: "UTC",
                    workingDays: [],
                },
            }),
        ).toThrow("3660 consecutive non-business days");
        expect(
            getNextBusinessDay({ date: "nope", timeZone: "UTC" }),
        ).toBeUndefined();
    });
});
