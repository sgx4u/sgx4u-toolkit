import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";

/**
 * How a locale-style week number is counted.
 */
export interface WeekOfYearOptions extends TimeZoneOptions, WeekOptions {
    /**
     * How many days of the year the first week must contain.
     *
     * @defaultValue `1`
     */
    minimumDaysInFirstWeek?: number;
}
