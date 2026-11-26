import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link getISOWeek}.
 */
export interface GetISOWeekParams extends TimeZoneOptions {
    /**
     * The date to read.
     */
    date: DateInput;
}