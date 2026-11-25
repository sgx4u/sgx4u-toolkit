import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * How an interval's length is broken down.
 */
export interface IntervalDurationOptions extends TimeZoneOptions {
    /**
     * The largest unit in the result.
     *
     * @defaultValue `"day"`
     */
    largestUnit?: TimeUnit;
}
