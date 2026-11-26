import type { ObservancePolicy } from "../types/holiday.types.js";
import type { CalendarDate } from "../types/time.types.js";
import type { Weekday } from "../types/time.types.js";

/**
 * Fields for {@link getObservedDate}.
 */
export interface GetObservedDateParams {
    /**
     * The holiday's calendar date.
     */
    date: CalendarDate;
    /**
     * How a weekend holiday moves.
     */
    policy: ObservancePolicy;
    /**
     * ISO weekdays that are open. Non-working days count as the weekend.
     *
     * @defaultValue `[1, 2, 3, 4, 5]`
     */
    workingDays?: readonly Weekday[];
}
