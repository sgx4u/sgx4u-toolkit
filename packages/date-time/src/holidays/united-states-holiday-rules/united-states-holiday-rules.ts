import type { HolidayRule } from "../../types/holiday.types.js";

/**
 * United States federal holidays, with the observed weekday.
 *
 * The eleven holidays are the ones in 5 U.S.C. § 6103. A holiday that
 * falls on Saturday is observed on Friday, and one that falls on Sunday
 * is observed on Monday (`nearest-weekday`).
 */
export const unitedStatesHolidayRules: readonly HolidayRule[] = [
    {
        name: "New Year's Day",
        date: { kind: "fixed", month: 1, day: 1 },
        observed: "nearest-weekday",
    },
    {
        name: "Birthday of Martin Luther King, Jr.",
        date: { kind: "nth-weekday", month: 1, weekday: 1, occurrence: 3 },
    },
    {
        name: "Washington's Birthday",
        date: { kind: "nth-weekday", month: 2, weekday: 1, occurrence: 3 },
    },
    {
        name: "Memorial Day",
        date: { kind: "nth-weekday", month: 5, weekday: 1, occurrence: -1 },
    },
    {
        name: "Juneteenth National Independence Day",
        date: { kind: "fixed", month: 6, day: 19 },
        observed: "nearest-weekday",
    },
    {
        name: "Independence Day",
        date: { kind: "fixed", month: 7, day: 4 },
        observed: "nearest-weekday",
    },
    {
        name: "Labor Day",
        date: { kind: "nth-weekday", month: 9, weekday: 1, occurrence: 1 },
    },
    {
        name: "Columbus Day",
        date: { kind: "nth-weekday", month: 10, weekday: 1, occurrence: 2 },
    },
    {
        name: "Veterans Day",
        date: { kind: "fixed", month: 11, day: 11 },
        observed: "nearest-weekday",
    },
    {
        name: "Thanksgiving Day",
        date: { kind: "nth-weekday", month: 11, weekday: 4, occurrence: 4 },
    },
    {
        name: "Christmas Day",
        date: { kind: "fixed", month: 12, day: 25 },
        observed: "nearest-weekday",
    },
];
