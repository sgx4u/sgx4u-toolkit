import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions } from "../types/options.types.js";
import type { RecurrenceRule } from "../types/recurrence.types.js";

/**
 * Fields for {@link getNextRecurrenceOccurrence}.
 */
export interface GetNextRecurrenceOccurrenceParams extends NowOptions {
    /**
     * The recurrence rule.
     */
    rule: RecurrenceRule;
    /**
     * Whether an occurrence exactly at `now` counts.
     *
     * @defaultValue `false`
     */
    includeNow?: boolean;
}