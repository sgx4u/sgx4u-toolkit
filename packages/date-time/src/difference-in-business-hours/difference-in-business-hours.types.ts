import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link differenceInBusinessHours}.
 */
export interface DifferenceInBusinessHoursParams extends BusinessCalendar {
    /**
     * The end date.
     */
    later: DateInput;
    /**
     * The start date.
     */
    earlier: DateInput;
}
