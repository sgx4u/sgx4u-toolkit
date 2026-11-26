import { readInterval } from "../utils/interval.utils.js";
import { assertInteger } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { occurrencesBetween } from "../utils/recurrence.utils.js";
import type { ListRecurrenceOccurrencesParams } from "./list-recurrence-occurrences.types.js";

/**
 * Lists occurrences inside an interval.
 *
 * Occurrences are generated on the wall clock in the rule's time zone and
 * resolved with `disambiguation: "compatible"`. A day that does not exist,
 * such as 30 February, is skipped. A floating rule is evaluated in UTC.
 *
 * @param params - `rule`, `start`, and `end` are required. `limit` defaults to 1000.
 * @returns The occurrences, oldest first.
 * @throws {@link RangeError} When more than `limit` occurrences fall in the interval.
 * @example
 * listRecurrenceOccurrences({
 *   rule: { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily", count: 2 },
 *   start: new Date("2026-11-26T00:00:00Z"),
 *   end: new Date("2026-11-30T00:00:00Z"),
 * }).length; // 2
 */
export function listRecurrenceOccurrences({
    rule,
    start,
    end,
    limit: limitInput,
}: ListRecurrenceOccurrencesParams): Date[] {
    const interval = readInterval({ start, end }, "interval");
    const limit = assertInteger(limitInput ?? 1000, "limit");
    if (limit < 1) {
        throw rangeError("limit", "a positive integer", limit);
    }
    return occurrencesBetween(
        rule,
        interval.start.getTime(),
        interval.end.getTime(),
        limit,
    );
}