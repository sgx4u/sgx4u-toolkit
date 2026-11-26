import { describe, expect, it } from "vitest";
import { getHolidaysInYear, isHoliday } from "../../index.js";
import { unitedStatesHolidayRules } from "../united-states.js";

describe("unitedStatesHolidayRules", () => {
    it("observes Independence Day 2026 on Friday 3 July", () => {
        const holidays = getHolidaysInYear({
            year: 2026,
            rules: unitedStatesHolidayRules,
        });
        expect(holidays)?.toHaveLength(11);
        expect(holidays!.every((holiday) => holiday.type === "public")).toBe(
            true,
        );
        expect(named(holidays, "Independence Day")).toEqual({
            date: { year: 2026, month: 7, day: 4 },
            observedDate: { year: 2026, month: 7, day: 3 },
        });
        expect(named(holidays, "New Year's Day")?.date).toEqual({
            year: 2026,
            month: 1,
            day: 1,
        });
        expect(
            named(holidays, "Birthday of Martin Luther King, Jr.")?.date,
        ).toEqual({
            year: 2026,
            month: 1,
            day: 19,
        });
        expect(named(holidays, "Washington's Birthday")?.date).toEqual({
            year: 2026,
            month: 2,
            day: 16,
        });
        expect(named(holidays, "Memorial Day")?.date).toEqual({
            year: 2026,
            month: 5,
            day: 25,
        });
        expect(named(holidays, "Juneteenth National Independence Day")).toEqual(
            {
                date: { year: 2026, month: 6, day: 19 },
                observedDate: { year: 2026, month: 6, day: 19 },
            },
        );
        expect(named(holidays, "Labor Day")?.date).toEqual({
            year: 2026,
            month: 9,
            day: 7,
        });
        expect(named(holidays, "Columbus Day")?.date).toEqual({
            year: 2026,
            month: 10,
            day: 12,
        });
        expect(named(holidays, "Veterans Day")?.date).toEqual({
            year: 2026,
            month: 11,
            day: 11,
        });
        expect(named(holidays, "Thanksgiving Day")?.date).toEqual({
            year: 2026,
            month: 11,
            day: 26,
        });
        expect(named(holidays, "Christmas Day")?.observedDate).toEqual({
            year: 2026,
            month: 12,
            day: 25,
        });
    });

    it("observes a Saturday holiday on Friday and a Sunday holiday on Monday", () => {
        const year2020 = getHolidaysInYear({
            year: 2020,
            rules: unitedStatesHolidayRules,
        });
        expect(named(year2020, "Independence Day")?.observedDate).toEqual({
            year: 2020,
            month: 7,
            day: 3,
        });
        const year2021 = getHolidaysInYear({
            year: 2021,
            rules: unitedStatesHolidayRules,
        });
        expect(named(year2021, "Independence Day")?.observedDate).toEqual({
            year: 2021,
            month: 7,
            day: 5,
        });
        expect(
            named(year2021, "Juneteenth National Independence Day")
                ?.observedDate,
        ).toEqual({ year: 2021, month: 6, day: 18 });
        expect(
            named(
                getHolidaysInYear({
                    year: 2022,
                    rules: unitedStatesHolidayRules,
                }),
                "New Year's Day",
            )?.observedDate,
        ).toEqual({ year: 2021, month: 12, day: 31 });
    });

    it("rejects a year that is not an integer", () => {
        expect(
            getHolidaysInYear({
                year: 2026.5,
                rules: unitedStatesHolidayRules,
            }),
        ).toBeUndefined();
        expect(
            getHolidaysInYear({
                year: "2026" as never,
                rules: unitedStatesHolidayRules,
            }),
        ).toBeUndefined();
    });

    it("matches the observed Friday in UTC and the previous evening in New York", () => {
        const holidays2026 =
            getHolidaysInYear({
                year: 2026,
                rules: unitedStatesHolidayRules,
            }) ?? [];
        const configuredHolidays = holidays2026.map((holiday) => ({
            date: `${holiday.observedDate.year}-${String(holiday.observedDate.month).padStart(2, "0")}-${String(holiday.observedDate.day).padStart(2, "0")}`,
            name: holiday.name,
        }));
        expect(
            isHoliday({
                date: "2026-07-03T03:00:00Z",
                holidays: configuredHolidays,
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isHoliday({
                date: "2026-07-03T03:00:00Z",
                holidays: configuredHolidays,
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isHoliday({
                date: "2026-07-15T16:00:00Z",
                holidays: configuredHolidays,
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isHoliday({
                date: "2026-01-15T17:00:00Z",
                holidays: configuredHolidays,
                timeZone: "America/New_York",
            }),
        ).toBe(false);
    });
});

/**
 * @param holidays - Holidays expanded for one year.
 * @param name - The holiday name.
 * @returns The calendar date and the observed date.
 */
function named(
    holidays: ReturnType<typeof getHolidaysInYear>,
    name: string,
):
    | {
          date: { year: number; month: number; day: number };
          observedDate: { year: number; month: number; day: number };
      }
    | undefined {
    const match = holidays?.find((item) => item.name === name);
    if (match === undefined) {
        return undefined;
    }
    return { date: match.date, observedDate: match.observedDate };
}
