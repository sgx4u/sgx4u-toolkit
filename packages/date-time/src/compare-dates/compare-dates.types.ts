import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link compareDates}.
 */
export interface CompareDatesParams {
    /**
     * The first date.
     */
    first: DateInput;
    /**
     * The second date.
     */
    second: DateInput;
}