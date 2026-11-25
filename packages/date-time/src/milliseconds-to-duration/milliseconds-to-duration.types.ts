import type { ClockUnit } from "../types/time.types.js";

/**
 * Which units a millisecond length is split into.
 */
export interface MillisecondsToDurationOptions {
    /**
     * The largest unit in the result. `"week"` uses 7 days and `"day"` uses 24 hours.
     *
     * @defaultValue `"day"`
     */
    largestUnit?: "week" | ClockUnit | "day";
    /**
     * The smallest unit in the result.
     *
     * @defaultValue `"millisecond"`
     */
    smallestUnit?: ClockUnit;
}
