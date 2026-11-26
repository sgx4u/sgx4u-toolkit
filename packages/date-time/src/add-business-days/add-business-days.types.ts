import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link addBusinessDays}.
 */
export interface AddBusinessDaysParams extends BusinessCalendar {
    /**
     * The starting instant.
     */
    date: DateInput;
    /**
     * Business days to add.
     */
    amount: number;
}
