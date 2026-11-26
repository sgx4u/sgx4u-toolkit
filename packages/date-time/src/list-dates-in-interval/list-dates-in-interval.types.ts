import type { Duration } from "../types/duration.types.js";
import type { DateInput } from "../types/date-input.types.js";
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

/**
 * Fields for {@link listDatesInInterval}.
 */
export interface ListDatesInIntervalParams extends ListDatesInIntervalOptions {
    /**
     * The inclusive start of the half-open interval.
     */
    start: DateInput;
    /**
     * The exclusive end of the half-open interval.
     */
    end: DateInput;
}