import { describe, expect, it } from "vitest";
import {
    addBusinessHours,
    differenceInBusinessDays,
    differenceInBusinessHours,
    getNextBusinessDay,
    getNextBusinessHoursStart,
    getPreviousBusinessDay,
    isWithinBusinessHours,
    listBusinessDaysInInterval,
} from "../index.js";

const utc = { timeZone: "UTC" };

describe("business hours", () => {
    it("skips the weekend and counts only open time", () => {
        expect(
            getNextBusinessDay("2026-11-27T15:00:00Z", utc).toISOString(),
        ).toBe("2026-11-30T00:00:00.000Z");
        expect(
            getPreviousBusinessDay("2026-11-30T15:00:00Z", utc).toISOString(),
        ).toBe("2026-11-27T00:00:00.000Z");
        expect(
            differenceInBusinessDays(
                "2026-11-30T00:00:00Z",
                "2026-11-27T00:00:00Z",
                utc,
            ),
        ).toBe(1);
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-27T00:00:00Z"),
                    end: new Date("2026-11-30T00:00:00Z"),
                },
                utc,
            ),
        ).toHaveLength(1);
        expect(isWithinBusinessHours("2026-11-26T12:00:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("2026-11-26T17:00:00Z", utc)).toBe(false);
        expect(isWithinBusinessHours("2026-11-28T12:00:00Z", utc)).toBe(false);
        expect(
            getNextBusinessHoursStart(
                "2026-11-26T08:00:00Z",
                utc,
            ).toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            addBusinessHours({
                date: "2026-11-26T16:00:00Z",
                duration: { hours: 2 },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-27T10:00:00.000Z");
        expect(
            differenceInBusinessHours(
                "2026-11-27T10:00:00Z",
                "2026-11-26T16:00:00Z",
                utc,
            ),
        ).toBe(2);
        expect(() =>
            addBusinessHours({
                date: "2026-11-26T12:00:00Z",
                duration: { days: 1 },
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
    });

    it("returns undefined for a bad date or duration", () => {
        expect(
            addBusinessHours({
                date: "nope",
                duration: { hours: 1 },
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(
            addBusinessHours({
                date: "2026-11-26T12:00:00Z",
                duration: { hours: 1, extra: 1 } as never,
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});