import type { DateInput } from "../types/date-input.types.js";
import { closestDate } from "../utils/compare.utils.js";

/**
 * Returns the index of the candidate nearest to a target.
 *
 * On a tie the earlier candidate wins. Equal candidates keep the first
 * index. An empty list returns `-1`.
 *
 * @param target - The instant to approach.
 * @param candidates - The dates to search.
 * @returns The index, or `-1` when `candidates` is empty.
 * @throws {@link TypeError} When `candidates` is not an array.
 * @throws {@link RangeError} When a value is not a real date.
 * @example
 * findClosestDateIndex("2024-01-01T12:00:00Z", ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"]); // 1
 */
export function findClosestDateIndex(
    target: DateInput,
    candidates: readonly DateInput[],
): number {
    return closestDate(target, candidates)?.index ?? -1;
}
