import type { Weekday } from "../types/time.types.js";

/**
 * Which days count as the weekend while moving a holiday.
 */
export interface ObservedDateOptions {
    /**
     * ISO weekdays that are closed.
     *
     * @defaultValue `[6, 7]`
     */
    weekendDays?: readonly Weekday[];
}
