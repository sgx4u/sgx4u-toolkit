import type { TimeZoneOptions } from "../types/options.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * How far a duration is balanced.
 */
export interface NormalizeDurationOptions extends TimeZoneOptions {
    /**
     * The largest unit the clock fields may carry into. Months and years are
     * not created unless `relativeTo` is set.
     *
     * @defaultValue `"day"`
     */
    largestUnit?: TimeUnit;
    /**
     * The instant used when balancing on the calendar. Without it, a day is
     * 24 hours and months and years are left unchanged.
     */
    relativeTo?: DateInput;
}

/**
 * Fields for {@link normalizeDuration}.
 */
export interface NormalizeDurationParams extends NormalizeDurationOptions {
    /**
     * The duration to balance.
     */
    duration: Duration;
}
