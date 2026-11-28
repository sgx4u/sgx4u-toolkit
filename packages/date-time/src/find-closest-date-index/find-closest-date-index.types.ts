import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link findClosestDateIndex}.
 */
export interface FindClosestDateIndexParams {
    /**
     * The instant to approach.
     */
    target: DateInput;
    /**
     * The dates to search.
     */
    candidates: readonly DateInput[];
}
