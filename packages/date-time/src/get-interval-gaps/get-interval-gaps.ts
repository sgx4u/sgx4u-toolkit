import type { Interval } from "../types/interval.types.js";
import { typeError } from "../utils/error.utils.js";
import {
    mergeIntervalList,
    readInterval,
    subtractIntervalList,
} from "../utils/interval.utils.js";
import type { GetIntervalGapsParams } from "./get-interval-gaps.types.js";

/**
 * Returns the uncovered time between intervals.
 *
 * When `within` is set, the result is the part of that window the
 * intervals do not cover. Otherwise the result is the gaps between the
 * sorted intervals.
 *
 * @param params - `intervals` are the covered ranges; `within` is optional.
 * @returns The gaps, sorted, without empty intervals, or `undefined` when an interval is not usable.
 * @throws {@link TypeError} When `intervals` is not an array.
 * @example
 * getIntervalGaps({
 *   intervals: [
 *     { start: new Date(0), end: new Date(5) },
 *     { start: new Date(10), end: new Date(15) },
 *   ],
 * })[0]?.start.getTime(); // 5
 */
export function getIntervalGaps({
    intervals,
    within,
}: GetIntervalGapsParams): Interval[] | undefined {
    if (!Array.isArray(intervals)) {
        throw typeError("intervals", "an array of intervals", intervals);
    }
    let merged: Interval[];
    try {
        merged = mergeIntervalList(intervals, true);
    } catch {
        return undefined;
    }
    if (within !== undefined) {
        let window: Interval;
        try {
            window = readInterval(within, "within");
        } catch {
            return undefined;
        }
        return subtractIntervalList(window, merged);
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
