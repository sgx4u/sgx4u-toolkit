import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";

/**
 * How a month is laid out as weeks.
 */
export interface MonthCalendarOptions extends TimeZoneOptions, WeekOptions {
    /**
     * Whether the grid always has six weeks.
     *
     * @defaultValue `false`
     */
    fixedWeekCount?: boolean;
}

/**
 * Fields for {@link createMonthCalendarGrid}.
 */
export interface CreateMonthCalendarGridParams extends MonthCalendarOptions {
    /**
     * The Gregorian year.
     */
    year: number;
    /**
     * The month, from 1 through 12.
     */
    month: number;
}