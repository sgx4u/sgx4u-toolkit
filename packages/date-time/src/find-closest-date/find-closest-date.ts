import { closestDate } from "../utils/compare.utils.js";
import type { FindClosestDateParams } from "./find-closest-date.types.js";

/**
 * Returns the candidate nearest to a target.
 *
 * On a tie the earlier candidate wins. When two candidates are the same
 * instant, the first one in the list wins. An empty list returns
 * `undefined`.
 *
 * @param params - `target` and `candidates` are required.
 * @returns A new `Date`, or `undefined` when `candidates` is empty.
 * @throws {@link TypeError} When `candidates` is not an array.
 * @throws {@link RangeError} When `target` or a candidate is not a real date.
 * @example
 * findClosestDate({
 *   target: "2024-01-01T12:00:00Z",
 *   candidates: ["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"],
 * })?.toISOString(); // "2024-01-01T00:00:00.000Z"
 */
export function findClosestDate({
    target,
    candidates,
}: FindClosestDateParams): Date | undefined {
    return closestDate(target, candidates)?.date;
}
