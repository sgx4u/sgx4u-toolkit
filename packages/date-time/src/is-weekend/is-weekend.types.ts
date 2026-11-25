import type { TimeZoneOptions } from "../types/options.types.js";
import type { Weekday } from "../types/time.types.js";

/**
 * Which weekdays count as the weekend.
 */
export interface IsWeekendOptions extends TimeZoneOptions {
    /**
     * ISO weekdays that are weekend days.
     *
     * @defaultValue `[6, 7]`
     */
    weekendDays?: readonly Weekday[];
}
