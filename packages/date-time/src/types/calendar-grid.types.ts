import type { Weekday } from "./time.types.js";

/**
 * One cell of a month grid. `date` is the start of that day in the zone.
 */
export interface MonthCalendarDay {
    date: Date;
    isInMonth: boolean;
}

/**
 * Seven days of a month grid, starting on the requested weekday.
 */
export interface MonthCalendarWeek {
    days: MonthCalendarDay[];
}

/**
 * The weeks that cover one month, including leading and trailing days.
 */
export interface MonthCalendarGrid {
    year: number;
    month: number;
    weeks: MonthCalendarWeek[];
}

/**
 * Week rules reported by `Intl` for a locale.
 */
export interface LocaleWeekInfo {
    firstDay: Weekday;
    weekendDays: Weekday[];
    minimumDaysInFirstWeek: number;
}
