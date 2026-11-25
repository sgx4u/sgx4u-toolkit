import type { RecurrenceRule } from "../types/recurrence.types.js";
import { parseRecurrenceText } from "../utils/recurrence.utils.js";

/**
 * Parses an RFC 5545 recurrence.
 *
 * The text may contain `DTSTART` with `TZID` or `Z`, an `RRULE`, and
 * `RDATE` and `EXDATE` lines. `RSCALE` and `SKIP` are not supported.
 * A floating start is evaluated in UTC.
 *
 * @param value - The rule text.
 * @returns The rule, or `undefined` when the text is not supported.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseRecurrenceRule("DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY")?.frequency; // "daily"
 */
export function parseRecurrenceRule(value: string): RecurrenceRule | undefined {
    return parseRecurrenceText(value);
}
