import type { RecurrenceRule } from "../types/recurrence.types.js";
import { describeRecurrence } from "../utils/recurrence.utils.js";

/**
 * Describes a recurrence rule in English.
 *
 * @param rule - The rule to describe.
 * @returns A sentence such as `Every 2 weeks on Monday and Friday`.
 * @example
 * describeRecurrenceRule({
 *   start: new Date("2026-11-26T09:00:00Z"),
 *   frequency: "weekly",
 *   interval: 2,
 *   byWeekday: [{ weekday: 1 }, { weekday: 5 }],
 * }); // "Every 2 weeks on Monday and Friday"
 */
export function describeRecurrenceRule(rule: RecurrenceRule): string {
    return describeRecurrence(rule);
}
