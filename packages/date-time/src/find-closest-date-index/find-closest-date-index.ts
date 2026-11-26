import { readDateInput } from "../utils/date-input.utils.js";
import type { FindClosestDateIndexParams } from "./find-closest-date-index.types.js";

/**
 * Returns the index of the candidate nearest to a target.
 *
 * On a tie the earlier candidate wins. Equal candidates keep the first
 * index. An empty list returns `-1`.
 *
 * @param params - `target` and `candidates` are required.
 * @returns The index, `-1` when `candidates` is empty, or `undefined` when input is not usable.
 * @example
 * findClosestDateIndex({
 *   target: "2024-01-01T12:00:00Z",
 *   candidates: ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"],
 * }); // 1
 */
export function findClosestDateIndex({
    target,
    candidates,
}: FindClosestDateIndexParams): number | undefined {
    if (!Array.isArray(candidates)) {
        return undefined;
    }
    if (candidates.length === 0) {
        return -1;
    }
    const targetInstant = readDateInput(target);
    if (targetInstant === undefined) {
        return undefined;
    }
    const targetTime = targetInstant.getTime();
    let matchIndex: number | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;
    let bestTime = Number.POSITIVE_INFINITY;
    for (const [index, value] of candidates.entries()) {
        const date = readDateInput(value);
        if (date === undefined) {
            return undefined;
        }
        const dateTime = date.getTime();
        const distance = Math.abs(dateTime - targetTime);
        const isCloser = distance < bestDistance;
        const isTieAndEarlier =
            distance === bestDistance &&
            matchIndex !== undefined &&
            dateTime < bestTime;
        if (matchIndex === undefined || isCloser || isTieAndEarlier) {
            matchIndex = index;
            bestDistance = distance;
            bestTime = dateTime;
        }
    }
    return matchIndex;
}
