import { describe, expect, it } from "vitest";
import { getDateParts } from "../index.js";

describe("getDateParts", () => {
    it("reads wall-clock fields in the zone", () => {
        expect(
            getDateParts({
                date: "2024-06-15T16:00:00.123Z",
                timeZone: "America/New_York",
            }),
        ).toEqual({
            year: 2024,
            month: 6,
            day: 15,
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 123,
            weekday: 6,
            offsetMinutes: -240,
        });
    });

    it("reads a date-only string as midnight in that zone", () => {
        const parts = getDateParts({
            date: "2026-11-26",
            timeZone: "Asia/Kolkata",
        });
        expect(parts).toBeDefined();
        expect(parts?.year).toBe(2026);
        expect(parts?.month).toBe(11);
        expect(parts?.day).toBe(26);
        expect(parts?.hour).toBe(0);
        expect(parts?.offsetMinutes).toBe(330);
    });

    it("uses the system zone when timeZone is omitted", () => {
        const parts = getDateParts({ date: "2024-06-15T00:00:00.000Z" });
        expect(parts).toBeDefined();
        const systemParts = new Intl.DateTimeFormat("en-US", {
            timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
            hourCycle: "h23",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
        }).formatToParts(new Date("2024-06-15T00:00:00.000Z"));
        const values = new Map(
            systemParts
                .filter((part) => part.type !== "literal")
                .map((part) => [part.type, Number(part.value)]),
        );

        expect(parts?.year).toBe(values.get("year"));
        expect(parts?.month).toBe(values.get("month"));
        expect(parts?.day).toBe(values.get("day"));
        expect(parts?.hour).toBe(
            values.get("hour") === 24 ? 0 : values.get("hour"),
        );
    });

    it("reports a fractional offset for America/Detroit in 1904", () => {
        const parts = getDateParts({
            date: "1904-06-01T17:32:11.000Z",
            timeZone: "America/Detroit",
        });
        expect(parts?.hour).toBe(12);
        expect(parts?.minute).toBe(0);
        expect(parts?.second).toBe(0);
        expect(parts?.offsetMinutes).toBeCloseTo(-332.1833333333, 6);
    });

    it("returns undefined for an invalid date", () => {
        expect(getDateParts({ date: Number.NaN })).toBeUndefined();
        expect(
            getDateParts({ date: true as unknown as string }),
        ).toBeUndefined();
    });
});
