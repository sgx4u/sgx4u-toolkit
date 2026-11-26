import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";

/**
 * Fields for {@link addBusinessHours}.
 */
export interface AddBusinessHoursParams extends BusinessCalendar {
    /**
     * The start instant.
     */
    date: DateInput;
    /**
     * Hours, minutes, seconds, or milliseconds.
     */
    duration: Duration;
}