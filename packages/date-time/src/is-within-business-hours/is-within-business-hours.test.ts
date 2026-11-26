import { describe, expect, it } from "vitest";
import { isWithinBusinessHours } from "../index.js";

const utc = { timeZone: "UTC" };

describe("isWithinBusinessHours", () => {
    it("includes 09:00 and excludes 17:00 on a business day", () => {
        expect(isWithinBusinessHours("2026-11-26T09:00:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("2026-11-26T12:00:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("2026-11-26T16:59:59Z", utc)).toBe(true);
        expect(isWithinBusinessHours("2026-11-26T17:00:00Z", utc)).toBe(false);
        expect(isWithinBusinessHours("2026-11-26T08:59:59Z", utc)).toBe(false);
        expect(isWithinBusinessHours("2026-11-28T12:00:00Z", utc)).toBe(false);
        expect(isWithinBusinessHours("2026-11-29T12:00:00Z", utc)).toBe(false);
        expect(isWithinBusinessHours("2024-02-29T12:00:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("2024-02-29T17:00:00Z", utc)).toBe(false);
        expect(isWithinBusinessHours("0000-01-03T12:00:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("0000-01-01T12:00:00Z", utc)).toBe(false);
        expect(isWithinBusinessHours("9999-12-31T12:00:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("9999-12-31T17:00:00Z", utc)).toBe(false);
    });

    it("closes a holiday and can treat the whole business day as open", () => {
        expect(
            isWithinBusinessHours("2026-11-26T12:00:00Z", {
                ...utc,
                holidays: ["2026-11-26"],
            }),
        ).toBe(false);
        expect(
            isWithinBusinessHours("2026-11-26T03:00:00Z", {
                ...utc,
                workingHours: [],
            }),
        ).toBe(true);
        expect(
            isWithinBusinessHours("2026-11-26T17:00:00Z", {
                ...utc,
                workingHours: [],
            }),
        ).toBe(true);
        expect(
            isWithinBusinessHours("2026-11-28T12:00:00Z", {
                ...utc,
                workingHours: [],
            }),
        ).toBe(false);
        expect(
            isWithinBusinessHours("2026-11-27T12:00:00Z", {
                ...utc,
                holidays: (date) => date.toISOString().startsWith("2026-11-27"),
            }),
        ).toBe(false);
    });

    it("honors a split day and an overnight window", () => {
        const split = {
            ...utc,
            workingHours: [
                { start: "09:00", end: "12:00" },
                { start: "13:00", end: "17:00" },
            ],
        };
        const overnight = {
            ...utc,
            workingHours: [{ start: "22:00", end: "06:00" }],
        };

        expect(isWithinBusinessHours("2026-11-26T09:00:00Z", split)).toBe(true);
        expect(isWithinBusinessHours("2026-11-26T12:00:00Z", split)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-26T12:30:00Z", split)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-26T13:00:00Z", split)).toBe(true);
        expect(isWithinBusinessHours("2026-11-27T23:00:00Z", overnight)).toBe(
            true,
        );
        expect(isWithinBusinessHours("2026-11-28T02:00:00Z", overnight)).toBe(
            true,
        );
        expect(isWithinBusinessHours("2026-11-28T06:00:00Z", overnight)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-28T22:00:00Z", overnight)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-30T02:00:00Z", overnight)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-30T22:00:00Z", overnight)).toBe(
            true,
        );
    });

    it("uses the local clock across a daylight-saving change", () => {
        const newYork = { timeZone: "America/New_York" };
        const santiago = { timeZone: "America/Santiago" };

        expect(isWithinBusinessHours("2024-03-11T13:00:00Z", newYork)).toBe(
            true,
        );
        expect(isWithinBusinessHours("2024-03-11T12:00:00Z", newYork)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2024-03-11T21:00:00Z", newYork)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-26T14:00:00Z", newYork)).toBe(
            true,
        );
        expect(isWithinBusinessHours("2026-11-26T13:59:00Z", newYork)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2026-11-26T13:59:00Z", utc)).toBe(true);
        expect(isWithinBusinessHours("2024-09-09T13:00:00Z", santiago)).toBe(
            true,
        );
        expect(isWithinBusinessHours("2024-09-09T11:00:00Z", santiago)).toBe(
            false,
        );
        expect(isWithinBusinessHours("2024-09-08T15:00:00Z", santiago)).toBe(
            false,
        );
    });

    it("throws when the date or the time zone is not usable", () => {
        expect(() => isWithinBusinessHours("2024-02-30", utc)).toThrow(
            RangeError,
        );
        expect(() => isWithinBusinessHours(new Date(Number.NaN), utc)).toThrow(
            RangeError,
        );
        expect(() =>
            isWithinBusinessHours(null as unknown as string, utc),
        ).toThrow(TypeError);
        expect(() =>
            isWithinBusinessHours("2026-11-26T12:00:00Z", {
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
    });
});
