import { describe, expect, it } from "vitest";
import { getDateParts, isWeekend } from "../index.js";

const utc = { timeZone: "UTC" };

describe("isWeekend", () => {
    it("uses Saturday and Sunday when weekendDays is omitted", () => {
        expect(isWeekend("2026-11-28T00:00:00Z", utc)).toBe(true);
        expect(isWeekend("2026-11-29T23:59:59Z", utc)).toBe(true);
        expect(isWeekend("2026-11-27T23:59:59Z", utc)).toBe(false);
        expect(isWeekend("2026-11-30T00:00:00Z", utc)).toBe(false);
        expect(isWeekend("2024-02-29T12:00:00Z", utc)).toBe(false);
        expect(isWeekend("2024-03-02T00:00:00Z", utc)).toBe(true);
        expect(isWeekend("0000-01-01T00:00:00Z", utc)).toBe(true);
        expect(isWeekend("0000-02-29T00:00:00Z", utc)).toBe(false);
        expect(isWeekend("9999-12-31T00:00:00Z", utc)).toBe(false);
    });

    it("accepts a custom weekend and an empty weekend", () => {
        const fridaySaturday = { ...utc, weekendDays: [5, 6] as const };

        expect(isWeekend("2026-11-27T00:00:00Z", fridaySaturday)).toBe(true);
        expect(isWeekend("2026-11-28T00:00:00Z", fridaySaturday)).toBe(true);
        expect(isWeekend("2026-11-29T00:00:00Z", fridaySaturday)).toBe(false);
        expect(
            isWeekend("2026-11-28T00:00:00Z", { ...utc, weekendDays: [] }),
        ).toBe(false);
        expect(
            isWeekend("2026-11-29T00:00:00Z", {
                ...utc,
                weekendDays: [7, 7],
            }),
        ).toBe(true);
    });

    it("reads the weekday in the time zone, including a daylight-saving date", () => {
        expect(isWeekend("2026-11-28T03:00:00Z", utc)).toBe(true);
        expect(
            isWeekend("2026-11-28T03:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isWeekend("2024-09-07T03:30:00Z", {
                timeZone: "America/Santiago",
            }),
        ).toBe(false);
        expect(isWeekend("2024-09-07T03:30:00Z", utc)).toBe(true);
        expect(
            isWeekend("2024-09-08T04:00:00Z", {
                timeZone: "America/Santiago",
            }),
        ).toBe(true);
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-28T12:00:00Z";
        const weekday = getDateParts(date).weekday;

        expect(isWeekend(date)).toBe(weekday === 6 || weekday === 7);
    });

    it("throws for a bad date, weekday, or time zone", () => {
        expect(() => isWeekend("2024-02-30", utc)).toThrow(RangeError);
        expect(() => isWeekend(new Date(Number.NaN), utc)).toThrow(RangeError);
        expect(() => isWeekend(Number.NaN, utc)).toThrow(RangeError);
        expect(() =>
            isWeekend("2026-11-28T00:00:00Z", {
                ...utc,
                weekendDays: [0] as unknown as readonly [6],
            }),
        ).toThrow(RangeError);
        expect(() =>
            isWeekend("2026-11-28T00:00:00Z", {
                ...utc,
                weekendDays: [8] as unknown as readonly [6],
            }),
        ).toThrow(RangeError);
        expect(() =>
            isWeekend("2026-11-28T00:00:00Z", {
                weekendDays: "6" as unknown as readonly [6],
            }),
        ).toThrow(TypeError);
        expect(() => isWeekend(null as unknown as string, utc)).toThrow(
            TypeError,
        );
        expect(() =>
            isWeekend("2026-11-28T00:00:00Z", { timeZone: "Mars/Base" }),
        ).toThrow(RangeError);
    });
});
