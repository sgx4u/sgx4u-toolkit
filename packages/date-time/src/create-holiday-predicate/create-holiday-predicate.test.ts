import { describe, expect, it } from "vitest";
import { createHolidayPredicate } from "../index.js";
import { indiaHolidayRules } from "../holidays/india.js";
import { unitedStatesHolidayRules } from "../holidays/united-states.js";

describe("createHolidayPredicate", () => {
    it("matches Republic Day on the India calendar day", () => {
        const isIndianHoliday = createHolidayPredicate({
            rules: indiaHolidayRules,
            timeZone: "Asia/Kolkata",
        });
        expect(isIndianHoliday(new Date("2026-01-25T18:30:00Z"))).toBe(true);
        expect(isIndianHoliday(new Date("2026-01-25T18:29:59Z"))).toBe(false);
        expect(isIndianHoliday(new Date("2024-01-25T18:30:00Z"))).toBe(true);
        expect(isIndianHoliday(new Date("2024-02-28T18:30:00Z"))).toBe(false);
        expect(isIndianHoliday(new Date("2024-12-24T18:30:00Z"))).toBe(true);
        expect(isIndianHoliday(new Date("2024-12-31T18:30:00Z"))).toBe(false);
    });

    it("matches the observed weekday by default and can require the official date", () => {
        const observed = createHolidayPredicate({
            rules: unitedStatesHolidayRules,
            timeZone: "UTC",
        });
        const official = createHolidayPredicate({
            rules: unitedStatesHolidayRules,
            timeZone: "UTC",
            matchObservedDate: false,
        });
        expect(observed(new Date("2020-07-03T00:00:00Z"))).toBe(true);
        expect(observed(new Date("2020-07-04T00:00:00Z"))).toBe(true);
        expect(official(new Date("2020-07-03T00:00:00Z"))).toBe(false);
        expect(official(new Date("2020-07-04T00:00:00Z"))).toBe(true);
    });

    it("reads Independence Day from midnight Eastern Daylight Time", () => {
        const isHoliday = createHolidayPredicate({
            rules: unitedStatesHolidayRules,
            timeZone: "America/New_York",
        });
        expect(isHoliday(new Date("2024-07-04T04:00:00.000Z"))).toBe(true);
        expect(isHoliday(new Date("2024-07-04T03:59:59.000Z"))).toBe(false);
    });

    it("rejects rules that are not an array", () => {
        expect(() => createHolidayPredicate({ rules: null as never })).toThrow(
            TypeError,
        );
        expect(() => createHolidayPredicate({ rules: null as never })).toThrow(
            "`rules` must be an array of holiday rules; received null.",
        );
    });
});