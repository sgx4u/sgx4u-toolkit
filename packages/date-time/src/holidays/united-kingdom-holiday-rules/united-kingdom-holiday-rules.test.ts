import { describe, expect, it } from "vitest";
import { getHolidaysInYear, isHoliday } from "../../index.js";
import { unitedKingdomHolidayRules } from "../united-kingdom.js";

describe("unitedKingdomHolidayRules", () => {
    it("places the 2026 England and Wales bank holidays", () => {
        const holidays = getHolidaysInYear(2026, unitedKingdomHolidayRules);
        expect(holidays).toHaveLength(8);
        expect(holidays.every((holiday) => holiday.type === "bank")).toBe(true);
        expect(holiday(holidays, "New Year's Day")).toEqual({
            date: { year: 2026, month: 1, day: 1 },
            observedDate: { year: 2026, month: 1, day: 1 },
        });
        expect(holiday(holidays, "Good Friday")?.date).toEqual({
            year: 2026,
            month: 4,
            day: 3,
        });
        expect(holiday(holidays, "Easter Monday")?.date).toEqual({
            year: 2026,
            month: 4,
            day: 6,
        });
        expect(holiday(holidays, "Early May bank holiday")?.date).toEqual({
            year: 2026,
            month: 5,
            day: 4,
        });
        expect(holiday(holidays, "Spring bank holiday")?.date).toEqual({
            year: 2026,
            month: 5,
            day: 25,
        });
        expect(holiday(holidays, "Summer bank holiday")?.date).toEqual({
            year: 2026,
            month: 8,
            day: 31,
        });
        expect(holiday(holidays, "Christmas Day")).toEqual({
            date: { year: 2026, month: 12, day: 25 },
            observedDate: { year: 2026, month: 12, day: 25 },
        });
        expect(holiday(holidays, "Boxing Day")).toEqual({
            date: { year: 2026, month: 12, day: 26 },
            observedDate: { year: 2026, month: 12, day: 28 },
        });
    });

    it("moves a Saturday Christmas and a Sunday Boxing Day to Monday and Tuesday", () => {
        const holidays = getHolidaysInYear(2021, unitedKingdomHolidayRules);
        expect(holiday(holidays, "Christmas Day")?.observedDate).toEqual({
            year: 2021,
            month: 12,
            day: 27,
        });
        expect(holiday(holidays, "Boxing Day")?.observedDate).toEqual({
            year: 2021,
            month: 12,
            day: 28,
        });
        expect(
            holiday(
                getHolidaysInYear(2022, unitedKingdomHolidayRules),
                "New Year's Day",
            )?.observedDate,
        ).toEqual({ year: 2022, month: 1, day: 3 });
    });

    it("rejects a year that is not an integer", () => {
        expect(() =>
            getHolidaysInYear(2026.5, unitedKingdomHolidayRules),
        ).toThrow(RangeError);
        expect(() =>
            getHolidaysInYear(2026.5, unitedKingdomHolidayRules),
        ).toThrow("`year`");
        expect(() =>
            getHolidaysInYear("2026" as never, unitedKingdomHolidayRules),
        ).toThrow(TypeError);
        expect(() =>
            getHolidaysInYear("2026" as never, unitedKingdomHolidayRules),
        ).toThrow("`year`");
    });

    it("matches Boxing Day on the observed Monday in UTC and not the evening before in New York", () => {
        expect(
            isHoliday("2026-12-28T00:30:00Z", unitedKingdomHolidayRules, {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isHoliday("2026-12-28T00:30:00Z", unitedKingdomHolidayRules, {
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isHoliday("2026-12-26T12:00:00Z", unitedKingdomHolidayRules, {
                timeZone: "Europe/London",
            }),
        ).toBe(true);
    });
});

/**
 * @param holidays - Holidays expanded for one year.
 * @param name - The holiday name.
 * @returns The calendar date and the observed date.
 */
function holiday(
    holidays: ReturnType<typeof getHolidaysInYear>,
    name: string,
):
    | {
          date: { year: number; month: number; day: number };
          observedDate: { year: number; month: number; day: number };
      }
    | undefined {
    const match = holidays.find((item) => item.name === name);
    if (match === undefined) {
        return undefined;
    }
    return { date: match.date, observedDate: match.observedDate };
}
