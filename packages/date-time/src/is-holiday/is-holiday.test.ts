import { describe, expect, it } from "vitest";
import { unitedStatesHolidayRules } from "../holidays/united-states.js";
import { isHoliday } from "../index.js";

describe("isHoliday", () => {
    it("matches Independence Day on the observed Friday and the Saturday itself", () => {
        expect(
            isHoliday("2026-07-03T00:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isHoliday("2026-07-04T12:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isHoliday("2026-11-26T12:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(true);
    });

    it("stops matching the substitute day when matchObservedDate is false", () => {
        expect(
            isHoliday("2026-07-03T00:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
                matchObservedDate: false,
            }),
        ).toBe(false);
        expect(
            isHoliday("2026-07-04T00:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
                matchObservedDate: false,
            }),
        ).toBe(true);
        expect(
            isHoliday("2026-07-02T00:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isHoliday("2026-07-03T23:59:59.999Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isHoliday("2026-07-05T00:00:00.000Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(false);
    });

    it("rejects rules that are not an array and a date that is not real", () => {
        expect(() =>
            isHoliday("2026-07-04T00:00:00Z", null, { timeZone: "UTC" }),
        ).toThrow(TypeError);
        expect(() =>
            isHoliday("2026-07-04T00:00:00Z", null, { timeZone: "UTC" }),
        ).toThrow("`rules`");
        expect(() =>
            isHoliday("nope", unitedStatesHolidayRules, { timeZone: "UTC" }),
        ).toThrow(RangeError);
        expect(() =>
            isHoliday("nope", unitedStatesHolidayRules, { timeZone: "UTC" }),
        ).toThrow("`date`");
        expect(isHoliday("2026-07-02T00:00:00Z", [], { timeZone: "UTC" })).toBe(
            false,
        );
    });

    it("matches the observed date by default", () => {
        const date = "2026-07-03T00:00:00Z";
        expect(
            isHoliday(date, unitedStatesHolidayRules, { timeZone: "UTC" }),
        ).toBe(
            isHoliday(date, unitedStatesHolidayRules, {
                timeZone: "UTC",
                matchObservedDate: true,
            }),
        );
    });

    it("keeps 03:00 UTC on 3 July in the previous New York day", () => {
        expect(
            isHoliday("2026-07-03T03:00:00Z", unitedStatesHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isHoliday("2026-07-03T03:00:00Z", unitedStatesHolidayRules, {
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isHoliday("2026-01-15T17:00:00Z", unitedStatesHolidayRules, {
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isHoliday("2026-07-15T16:00:00Z", unitedStatesHolidayRules, {
                timeZone: "America/New_York",
            }),
        ).toBe(false);
    });
});
