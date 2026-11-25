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
