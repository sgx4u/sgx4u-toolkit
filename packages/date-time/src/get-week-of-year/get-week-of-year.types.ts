import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";

/**
 * Fields for {@link getWeekOfYear}.
 */
export interface GetWeekOfYearParams extends TimeZoneOptions, WeekOptions {
    /**
     * The date to read.
     */
    date: DateInput;
    /**
     * How many days of the year the first week must contain.
     *
     * @defaultValue `1`
     */
    minimumDaysInFirstWeek?: number;
}