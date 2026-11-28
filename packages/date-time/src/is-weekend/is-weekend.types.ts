import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { Weekday } from "../types/time.types.js";

/**
 * Fields for {@link isWeekend}.
 */
export interface IsWeekendParams extends TimeZoneOptions {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * ISO weekdays that are open. Every other weekday is a weekend.
     *
     * @defaultValue `[1, 2, 3, 4, 5]`
     */
    workingDays?: readonly Weekday[];
}
