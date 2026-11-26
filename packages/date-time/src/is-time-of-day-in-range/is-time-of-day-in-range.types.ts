import type { TimeOfDay, TimeRange } from "../types/time.types.js";

/**
 * Fields for {@link isTimeOfDayInRange}.
 */
export interface IsTimeOfDayInRangeParams {
    /**
     * The time to test.
     */
    time: TimeOfDay;
    /**
     * The start and end, as text or a time of day.
     */
    range: TimeRange;
    /**
     * Whether the end instant of the range counts.
     *
     * @defaultValue `false`
     */
    includeEnd?: boolean;
}