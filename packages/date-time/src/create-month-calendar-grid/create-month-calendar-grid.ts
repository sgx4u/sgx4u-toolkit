import type {
    MonthCalendarDay,
    MonthCalendarGrid,
    MonthCalendarWeek,
} from "../types/calendar-grid.types.js";
import {
    addGregorianDays,
    daysInGregorianMonth,
    ISOWeekdayNumber,
} from "../utils/gregorian.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import type { CreateMonthCalendarGridParams } from "./create-month-calendar-grid.types.js";

export type { MonthCalendarOptions } from "./create-month-calendar-grid.types.js";

/**
 * Builds the weeks that cover one month, for a calendar UI.
 *
 * Each day is the start of that day in the zone. Leading and trailing
 * days from the neighboring months have `isInMonth: false`. With
 * `fixedWeekCount`, the grid always has six weeks.
 *
 * @param params - `year`, `month`, and optional layout fields.
 * @returns Four to six weeks, or exactly six when `fixedWeekCount` is `true`, or `undefined` when `year` or `month` is not usable.
 * @throws {@link RangeError} When `weekStartsOn` is invalid or `timeZone` is unusable.
 * @example
 * createMonthCalendarGrid({
 *   year: 2021,
 *   month: 2,
 *   timeZone: "UTC",
 *   weekStartsOn: 1,
 * })?.weeks.length; // 4
 */
export function createMonthCalendarGrid({
    year,
    month,
    weekStartsOn,
    timeZone,
    fixedWeekCount,
}: CreateMonthCalendarGridParams): MonthCalendarGrid | undefined {
    const yearNumber = readInteger(year);
    const monthNumber = readInteger(month);
    if (
        yearNumber === undefined ||
        monthNumber === undefined ||
        monthNumber < 1 ||
        monthNumber > 12
    ) {
        return undefined;
    }
    const weekStart = resolveWeekStartsOn(weekStartsOn);
    const zone = resolveTimeZone(timeZone);
    const firstWeekday = ISOWeekdayNumber(yearNumber, monthNumber, 1);
    const leading = (firstWeekday - weekStart + 7) % 7;
    const length = daysInGregorianMonth(yearNumber, monthNumber);
    const weekCount = fixedWeekCount ? 6 : Math.ceil((leading + length) / 7);
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
                        zone,
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

/**
 * @param value - A candidate integer.
 * @returns The value when it is a finite integer, otherwise `undefined`.
 */
function readInteger(value: unknown): number | undefined {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return undefined;
    }
    if (!Number.isInteger(value)) {
        return undefined;
    }
    return value;
}
