import { describe, expect, it } from "vitest";
import { differenceInBusinessHours } from "../index.js";

describe("differenceInBusinessHours", () => {
    it("counts the default 09:00 to 17:00 window and ignores time outside it", () => {
        expect(
            differenceInBusinessHours({
                later: "2026-11-27T10:00:00Z",
                earlier: "2026-11-26T16:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(2);
        expect(
            differenceInBusinessHours({
                later: "2026-11-26T09:00:00Z",
                earlier: "2026-11-26T08:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(0);
        expect(
            differenceInBusinessHours({
                later: "2026-11-26T16:00:00Z",
                earlier: "2026-11-27T10:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(-2);
    });

    it("counts a partial leap-day hour and the hours that cross New Year", () => {
        expect(
            differenceInBusinessHours({
                later: "2024-02-29T10:00:00Z",
                earlier: "2024-02-29T09:30:00Z",
                timeZone: "UTC",
            }),
        ).toBe(0.5);
        expect(
            differenceInBusinessHours({
                later: "2024-02-29T17:00:00Z",
                earlier: "2024-02-29T09:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(8);
        expect(
            differenceInBusinessHours({
                later: "2025-01-01T10:00:00Z",
                earlier: "2024-12-31T16:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(2);
    });

    it("counts two elapsed hours when the working window contains the spring-forward gap", () => {
        expect(
            differenceInBusinessHours({
                later: "2024-03-10T09:00:00Z",
                earlier: "2024-03-10T05:00:00Z",
                timeZone: "America/New_York",
                workingDays: [1, 2, 3, 4, 5, 6, 7],
                businessHours: [{ start: "01:00", end: "04:00" }],
            }),
        ).toBe(2);
    });

    it("returns undefined for a bad date and throws when the calendar has no open day", () => {
        expect(
            differenceInBusinessHours({
                later: "nope",
                earlier: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(() =>
            differenceInBusinessHours({
                later: "2031-01-01T00:00:00Z",
                earlier: "2020-01-01T00:00:00Z",
                timeZone: "UTC",
                workingDays: [],
            }),
        ).toThrow(RangeError);
    });
});
