import type { Interval } from "../types/interval.types.js";

/**
 * Which occurrences to list.
 */
export interface ListRecurrenceOccurrencesOptions {
    /**
     * The half-open interval the occurrences must fall in.
     */
    between: Interval;
    /**
     * The most occurrences that may be returned.
     *
     * @defaultValue `1000`
     */
    limit?: number;
}
