import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link findClosestDate}.
 */
export interface FindClosestDateParams {
    /**
     * The instant to approach.
     */
    target: DateInput;
    /**
     * The dates to search. The array is not reordered.
     */
    candidates: readonly DateInput[];
}
