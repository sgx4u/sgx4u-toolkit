import type { DateInput } from "../types/date-input.types.js";
import { closestDate } from "../utils/compare.utils.js";

/**
 * Returns the candidate nearest to a target.
 *
 * On a tie the earlier candidate wins. When two candidates are the same
 * instant, the first one in the list wins. An empty list returns
 * `undefined`.
 *
 * @param target - The instant to approach.
 * @param candidates - The dates to search. The array is not reordered.
 * @returns A new `Date`, or `undefined` when `candidates` is empty.
 * @throws {@link TypeError} When `candidates` is not an array.
 * @throws {@link RangeError} When a value is not a real date.
 * @example
 * findClosestDate("2024-01-01T12:00:00Z", ["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"])?.toISOString(); // "2024-01-01T00:00:00.000Z"
 */
export function findClosestDate(
    target: DateInput,
    candidates: readonly DateInput[],
): Date | undefined {
    return closestDate(target, candidates)?.date;
}
