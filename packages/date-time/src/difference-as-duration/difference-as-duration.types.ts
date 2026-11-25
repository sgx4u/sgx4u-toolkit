import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Which units a difference is broken into.
 */
export interface DifferenceAsDurationOptions extends TimeZoneOptions {
    /**
     * The largest unit in the result.
     *
     * @defaultValue `"year"`
     */
    largestUnit?: TimeUnit;
    /**
     * The smallest unit in the result. A clock unit may be fractional so the
     * duration adds back exactly.
     *
     * @defaultValue `"millisecond"`
     */
    smallestUnit?: TimeUnit;
}
