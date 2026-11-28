import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link sortDates}.
 */
export interface SortDatesParams {
    /**
     * The dates to sort.
     */
    dates: readonly DateInput[];
    /**
     * Oldest first, or newest first.
     *
     * @defaultValue `"ascending"`
     */
    order?: "ascending" | "descending";
}
