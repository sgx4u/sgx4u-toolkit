import type { Duration } from "../types/duration.types.js";
import type { TimeOfDay } from "../types/time.types.js";

/**
 * Fields for {@link addToTimeOfDay}.
 */
export interface AddToTimeOfDayParams {
    /**
     * The starting time.
     */
    time: TimeOfDay;
    /**
     * The length to add. Clock fields may be fractional in the smallest unit.
     */
    duration: Duration;
}