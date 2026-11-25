import type { RecurrenceRule } from "../types/recurrence.types.js";
import { formatRecurrenceText } from "../utils/recurrence.utils.js";

/**
 * Writes a recurrence rule as RFC 5545 text.
 *
 * @param rule - The rule to write.
 * @returns `DTSTART` and `RRULE` lines, plus `RDATE` and `EXDATE` when the rule has them.
 * @example
 * formatRecurrenceRule({ start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" }).includes("FREQ=DAILY"); // true
 */
export function formatRecurrenceRule(rule: RecurrenceRule): string {
    return formatRecurrenceText(rule);
}
