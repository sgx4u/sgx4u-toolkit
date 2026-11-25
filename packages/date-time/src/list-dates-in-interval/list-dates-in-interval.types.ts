import type { Duration } from "../types/duration.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * How dates are stepped through an interval.
 */
export interface ListDatesInIntervalOptions
    extends TimeZoneOptions, WeekOptions {
    /**
     * The distance between dates.
     *
     * @defaultValue `{ days: 1 }`
     */
    step?: Duration;
    /**
     * When set, the first date is the first start of this unit at or after
     * the interval start.
     */
    alignToUnit?: TimeUnit;
}
