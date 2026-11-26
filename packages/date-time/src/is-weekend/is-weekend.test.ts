import { describe, expect, it } from "vitest";
import { getDateParts, isWeekend } from "../index.js";

const utc = { timeZone: "UTC" } as const;

describe("isWeekend", () => {
    it("uses Saturday and Sunday when workingDays is omitted", () => {
        expect(isWeekend({ date: "2026-11-28T00:00:00Z", ...utc })).toBe(true);
        expect(isWeekend({ date: "2026-11-29T23:59:59Z", ...utc })).toBe(true);
        expect(isWeekend({ date: "2026-11-27T23:59:59Z", ...utc })).toBe(false);
        expect(isWeekend({ date: "2026-11-30T00:00:00Z", ...utc })).toBe(false);
        expect(isWeekend({ date: "2024-02-29T12:00:00Z", ...utc })).toBe(false);
        expect(isWeekend({ date: "2024-03-02T00:00:00Z", ...utc })).toBe(true);
        expect(isWeekend({ date: "0000-01-01T00:00:00Z", ...utc })).toBe(true);
        expect(isWeekend({ date: "0000-02-29T00:00:00Z", ...utc })).toBe(false);
        expect(isWeekend({ date: "9999-12-31T00:00:00Z", ...utc })).toBe(false);
    });

    it("accepts custom working days", () => {
        const fridaySaturday = {
            ...utc,
            workingDays: [1, 2, 3, 4, 7] as const,
        };

        expect(
            isWeekend({ date: "2026-11-27T00:00:00Z", ...fridaySaturday }),
        ).toBe(true);
        expect(
            isWeekend({ date: "2026-11-28T00:00:00Z", ...fridaySaturday }),
        ).toBe(true);
        expect(
            isWeekend({ date: "2026-11-29T00:00:00Z", ...fridaySaturday }),
        ).toBe(false);
        expect(
            isWeekend({
                date: "2026-11-28T00:00:00Z",
                ...utc,
                workingDays: [1, 2, 3, 4, 5, 6, 7],
            }),
        ).toBe(false);
        expect(
            isWeekend({
                date: "2026-11-29T00:00:00Z",
                ...utc,
                workingDays: [7, 7],
            }),
        ).toBe(true);
    });

    it("reads the weekday in the time zone", () => {
        expect(isWeekend({ date: "2026-11-28T03:00:00Z", ...utc })).toBe(true);
        expect(
            isWeekend({
                date: "2026-11-28T03:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(false);
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-28T12:00:00Z";
        const weekday = getDateParts({ date }).weekday;

        expect(isWeekend({ date })).toBe(weekday === 6 || weekday === 7);
    });

    it("returns false for a bad date and throws for bad workingDays or zone", () => {
        expect(isWeekend({ date: "2024-02-30", ...utc })).toBe(false);
        expect(
            isWeekend({ date: new Date(Number.NaN), ...utc }),
        ).toBe(false);
        expect(isWeekend({ date: Number.NaN, ...utc })).toBe(false);
        expect(() =>
            isWeekend({
                date: "2026-11-28T00:00:00Z",
                ...utc,
                workingDays: [0] as unknown as readonly [6],
            }),
        ).toThrow(RangeError);
        expect(() =>
            isWeekend({
                date: "2026-11-28T00:00:00Z",
                workingDays: "6" as unknown as readonly [6],
            }),
        ).toThrow(TypeError);
        expect(() =>
            isWeekend({
                date: "2026-11-28T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
    });
});