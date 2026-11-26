import { describe, expect, it } from "vitest";
import { isHoliday } from "../index.js";

const republicDay = { date: "2026-01-26", name: "Republic Day" };

describe("isHoliday", () => {
    it("matches a named holiday and a holiday with no name", () => {
        expect(
            isHoliday({
                date: "2026-01-26T00:00:00+05:30",
                holidays: [republicDay],
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(true);
        expect(
            isHoliday({
                date: "2026-01-27",
                holidays: [republicDay],
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(false);
        expect(
            isHoliday({
                date: "2026-12-25T00:00:00Z",
                holidays: ["2026-12-25T00:00:00Z"],
                timeZone: "UTC",
            }),
        ).toBe(true);
    });

    it("returns the name only when includeName is true", () => {
        expect(
            isHoliday({
                date: "2026-01-26",
                holidays: [republicDay, { date: "2026-01-26", name: "Later" }],
                timeZone: "Asia/Kolkata",
                includeName: true,
            }),
        ).toEqual({ isHoliday: true, name: "Republic Day" });
        expect(
            isHoliday({
                date: "2026-12-25",
                holidays: [{ date: "2026-12-25" }],
                timeZone: "UTC",
                includeName: true,
            }),
        ).toEqual({ isHoliday: true });
        expect(
            isHoliday({
                date: "2026-01-27",
                holidays: [republicDay],
                timeZone: "UTC",
                includeName: true,
            }),
        ).toEqual({ isHoliday: false });
    });

    it("returns false for a date that is not real", () => {
        expect(
            isHoliday({
                date: "not-a-date",
                holidays: [republicDay],
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isHoliday({
                date: "not-a-date",
                holidays: [republicDay],
                includeName: true,
            }),
        ).toEqual({ isHoliday: false });
    });

    it("throws when holidays is not an array or the zone is unusable", () => {
        expect(() =>
            isHoliday({
                date: "2026-01-26",
                holidays: "2026-01-26" as unknown as [],
            }),
        ).toThrow(TypeError);
        expect(() =>
            isHoliday({
                date: "2026-01-26",
                holidays: [],
                timeZone: "Not/AZone",
            }),
        ).toThrow(RangeError);
    });
});
