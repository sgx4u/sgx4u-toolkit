import type { HolidayRule } from "../../types/holiday.types.js";

/**
 * Bank holidays for England and Wales.
 *
 * The list is the standing England and Wales bank holidays: New Year's
 * Day, Good Friday, Easter Monday, the early May holiday, the spring
 * holiday, the summer holiday, Christmas Day, and Boxing Day. A weekend
 * holiday moves to the next weekday. When that day is already a holiday,
 * it moves forward again, so a Saturday Christmas and a Sunday Boxing Day
 * are observed on Monday and Tuesday.
 */
export const unitedKingdomHolidayRules: readonly HolidayRule[] = [
    {
        name: "New Year's Day",
        type: "bank",
        date: { kind: "fixed", month: 1, day: 1 },
        observed: "next-weekday",
    },
    {
        name: "Good Friday",
        type: "bank",
        date: { kind: "easter-offset", days: -2 },
    },
    {
        name: "Easter Monday",
        type: "bank",
        date: { kind: "easter-offset", days: 1 },
    },
    {
        name: "Early May bank holiday",
        type: "bank",
        date: { kind: "nth-weekday", month: 5, weekday: 1, occurrence: 1 },
    },
    {
        name: "Spring bank holiday",
        type: "bank",
        date: { kind: "nth-weekday", month: 5, weekday: 1, occurrence: -1 },
    },
    {
        name: "Summer bank holiday",
        type: "bank",
        date: { kind: "nth-weekday", month: 8, weekday: 1, occurrence: -1 },
    },
    {
        name: "Christmas Day",
        type: "bank",
        date: { kind: "fixed", month: 12, day: 25 },
        observed: "next-weekday",
    },
    {
        name: "Boxing Day",
        type: "bank",
        date: { kind: "fixed", month: 12, day: 26 },
        observed: "next-weekday",
    },
];
