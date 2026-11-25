import type {
    MonthCalendarDay,
    MonthCalendarGrid,
    MonthCalendarWeek,
} from "../types/calendar-grid.types.js";
import { assertInteger, assertIntegerInRange } from "../utils/assert.utils.js";
import {
    addGregorianDays,
    daysInGregorianMonth,
    isoWeekdayNumber,
} from "../utils/gregorian.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import type { MonthCalendarOptions } from "./create-month-calendar-grid.types.js";

/**
 * Builds the weeks that cover one month, for a calendar UI.
 *
 * Each day is the start of that day in the zone. Leading and trailing
 * days from the neighboring months have `isInMonth: false`. With
 * `fixedWeekCount`, the grid always has six weeks.
 *
 * @param year - The Gregorian year.
 * @param month - The month, from 1 through 12.
 * @param options - `weekStartsOn` defaults to Monday. `fixedWeekCount` defaults to `false`.
 * @returns Four to six weeks, or exactly six when `fixedWeekCount` is `true`.
 * @throws {@link RangeError} When `month` is outside 1 through 12.
 * @example
 * createMonthCalendarGrid(2021, 2, { timeZone: "UTC", weekStartsOn: 1 }).weeks.length; // 4
 */
export function createMonthCalendarGrid(
    year: number,
    month: number,
    options?: MonthCalendarOptions,
): MonthCalendarGrid {
    const yearNumber = assertInteger(year, "year");
    const monthNumber = assertIntegerInRange(month, "month", 1, 12);
    const weekStartsOn = resolveWeekStartsOn(options?.weekStartsOn);
    const timeZone = resolveTimeZone(options?.timeZone);
    const firstWeekday = isoWeekdayNumber(yearNumber, monthNumber, 1);
    const leading = (firstWeekday - weekStartsOn + 7) % 7;
    const length = daysInGregorianMonth(yearNumber, monthNumber);
    const weekCount = options?.fixedWeekCount
        ? 6
        : Math.ceil((leading + length) / 7);
    const gridStart = addGregorianDays(yearNumber, monthNumber, 1, -leading);
    const weeks: MonthCalendarWeek[] = [];
    for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
        const days: MonthCalendarDay[] = [];
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
            const calendar = addGregorianDays(
                gridStart.year,
                gridStart.month,
                gridStart.day,
                weekIndex * 7 + dayIndex,
            );
            days.push({
                date: new Date(
                    instantFromWallTime(
                        {
                            year: calendar.year,
                            month: calendar.month,
                            day: calendar.day,
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisecond: 0,
                        },
                        timeZone,
                        "compatible",
                    ),
                ),
                isInMonth:
                    calendar.year === yearNumber &&
                    calendar.month === monthNumber,
            });
        }
        weeks.push({ days });
    }
    return { year: yearNumber, month: monthNumber, weeks };
}
