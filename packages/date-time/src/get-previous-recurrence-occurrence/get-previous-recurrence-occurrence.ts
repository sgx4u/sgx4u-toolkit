import type { RecurrenceRule } from "../types/recurrence.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { adjacentOccurrence } from "../utils/recurrence.utils.js";
import type { AdjacentRecurrenceOptions } from "../get-next-recurrence-occurrence/get-next-recurrence-occurrence.types.js";

/**
 * Returns the previous occurrence of a rule.
 *
 * @param rule - The recurrence rule.
 * @param options - `includeNow` defaults to `false` and `now` to the current time.
 * @returns The occurrence, or `undefined` when the rule has none behind.
 * @example
 * getPreviousRecurrenceOccurrence(
 *   { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
 *   { now: "2026-11-28T09:00:00Z" },
 * )?.toISOString(); // "2026-11-27T09:00:00.000Z"
 */
export function getPreviousRecurrenceOccurrence(
    rule: RecurrenceRule,
    options?: AdjacentRecurrenceOptions,
): Date | undefined {
    const timeZone = rule.timeZone ?? "UTC";
    const now =
        options?.now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(options.now, "now", timeZone).getTime();
    return adjacentOccurrence(rule, now, -1, options?.includeNow ?? false);
}
