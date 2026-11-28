import type { DateInput } from "../types/date-input.types.js";
import type { RecurrenceRule } from "../types/recurrence.types.js";

/**
 * Fields for {@link listRecurrenceOccurrences}.
 */
export interface ListRecurrenceOccurrencesParams {
    /**
     * The recurrence rule.
     */
    rule: RecurrenceRule;
    /**
     * The inclusive start of the half-open search window.
     */
    start: DateInput;
    /**
     * The exclusive end of the half-open search window.
     */
    end: DateInput;
    /**
     * The most occurrences that may be returned.
     *
     * @defaultValue `1000`
     */
    limit?: number;
}
