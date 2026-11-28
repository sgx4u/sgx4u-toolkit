import { parseRecurrenceRule } from "../parse-recurrence-rule/parse-recurrence-rule.js";

/**
 * Reports whether text is a supported recurrence rule.
 *
 * @param value - The rule text.
 * @returns `true` when `parseRecurrenceRule` returns a rule.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * isValidRecurrenceRule("DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY"); // true
 */
export function isValidRecurrenceRule(value: string): boolean {
    return parseRecurrenceRule(value) !== undefined;
}
