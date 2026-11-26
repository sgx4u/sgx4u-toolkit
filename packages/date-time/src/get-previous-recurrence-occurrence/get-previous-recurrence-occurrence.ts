import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { adjacentOccurrence } from "../utils/recurrence.utils.js";
import type { GetNextRecurrenceOccurrenceParams } from "../get-next-recurrence-occurrence/get-next-recurrence-occurrence.types.js";

/**
 * Returns the previous occurrence of a rule.
 *
 * @param params - `rule` is required. `includeNow` defaults to `false` and `now` to the current time.
 * @returns The occurrence, or `undefined` when the rule has none behind.
 * @throws {@link RangeError} When `now` is not a real date.
 * @example
 * getPreviousRecurrenceOccurrence({
 *   rule: { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
 *   now: "2026-11-28T09:00:00Z",
 * })?.toISOString(); // "2026-11-27T09:00:00.000Z"
 */
export function getPreviousRecurrenceOccurrence({
    rule,
    now,
    includeNow = false,
}: GetNextRecurrenceOccurrenceParams): Date | undefined {
    const timeZone = rule.timeZone ?? "UTC";
    const reference =
        now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(now, "now", timeZone).getTime();
    return adjacentOccurrence(rule, reference, -1, includeNow);
}