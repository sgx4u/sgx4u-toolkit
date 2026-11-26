import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link getEarliestDate}.
 */
export interface GetEarliestDateParams {
    /**
     * The dates to search.
     */
    dates: readonly DateInput[];
}