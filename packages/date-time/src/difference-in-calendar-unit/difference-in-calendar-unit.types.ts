import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { CalendarUnit } from "../types/time.types.js";

/**
 * Fields for {@link differenceInCalendarUnit}.
 */
export interface DifferenceInCalendarUnitParams
    extends TimeZoneOptions, WeekOptions {
    /**
     * The end instant.
     */
    later: DateInput;
    /**
     * The start instant.
     */
    earlier: DateInput;
    /**
     * `"year"`, `"quarter"`, `"month"`, `"week"`, or `"day"`.
     */
    unit: CalendarUnit;
}
