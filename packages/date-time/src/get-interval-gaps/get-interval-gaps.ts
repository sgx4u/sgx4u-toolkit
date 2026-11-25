import type { Interval } from "../types/interval.types.js";
import { typeError } from "../utils/error.utils.js";
import {
    mergeIntervalList,
    readInterval,
    subtractIntervalList,
} from "../utils/interval.utils.js";

/**
 * Returns the uncovered time between intervals.
 *
 * When `within` is set, the result is the part of that window the
 * intervals do not cover. Otherwise the result is the gaps between the
 * sorted intervals.
 *
 * @param intervals - The covered intervals.
 * @param within - An optional window to measure inside.
 * @returns The gaps, sorted, without empty intervals.
 * @throws {@link TypeError} When `intervals` is not an array.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * getIntervalGaps([
 *   { start: new Date(0), end: new Date(5) },
 *   { start: new Date(10), end: new Date(15) },
 * ])[0]?.start.getTime(); // 5
 */
export function getIntervalGaps(
    intervals: readonly Interval[],
    within?: Interval,
): Interval[] {
    if (!Array.isArray(intervals)) {
        throw typeError("intervals", "an array of intervals", intervals);
    }
    const merged = mergeIntervalList(intervals, true);
    if (within !== undefined) {
        return subtractIntervalList(readInterval(within, "within"), merged);
    }
    const gaps: Interval[] = [];
    for (let index = 1; index < merged.length; index += 1) {
        const previous = merged[index - 1];
        const current = merged[index];
        if (
            previous !== undefined &&
            current !== undefined &&
            current.start.getTime() > previous.end.getTime()
        ) {
            gaps.push({ start: previous.end, end: current.start });
        }
    }
    return gaps;
}
