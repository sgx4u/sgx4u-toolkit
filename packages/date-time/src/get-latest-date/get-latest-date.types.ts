import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link getLatestDate}.
 */
export interface GetLatestDateParams {
    /**
     * The dates to search.
     */
    dates: readonly DateInput[];
}
