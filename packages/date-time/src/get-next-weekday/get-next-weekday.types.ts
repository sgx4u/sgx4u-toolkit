import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { Weekday } from "../types/time.types.js";

/**
 * Fields for {@link getNextWeekday} and {@link stepToWeekday}.
 */
export interface GetNextWeekdayParams extends TimeZoneOptions {
    /**
     * The date to step from.
     */
    date: DateInput;
    /**
     * ISO weekday, Monday `1` through Sunday `7`.
     */
    weekday: Weekday;
    /**
     * When `true`, a date that is already that weekday returns the start of that day.
     *
     * @defaultValue `false`
     */
    includeCurrentDay?: boolean;
}
