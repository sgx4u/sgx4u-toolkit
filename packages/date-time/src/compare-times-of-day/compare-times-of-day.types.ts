import type { TimeOfDay } from "../types/time.types.js";

/**
 * Fields for {@link compareTimesOfDay}.
 */
export interface CompareTimesOfDayParams {
    /**
     * The first time of day.
     */
    first: TimeOfDay;
    /**
     * The second time of day.
     */
    second: TimeOfDay;
}
