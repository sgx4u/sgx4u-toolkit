import type { Interval } from "../types/interval.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Fields for {@link getIntervalDuration}.
 */
export interface GetIntervalDurationParams extends TimeZoneOptions {
    /**
     * The half-open interval.
     */
    interval: Interval;
    /**
     * The largest unit in the result.
     *
     * @defaultValue `"day"`
     */
    largestUnit?: TimeUnit;
}