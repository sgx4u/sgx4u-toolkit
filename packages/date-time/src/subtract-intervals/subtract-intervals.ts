import type { Interval } from "../types/interval.types.js";
import { typeError } from "../utils/error.utils.js";
import { readInterval, subtractIntervalList } from "../utils/interval.utils.js";

/**
 * Returns the parts of `source` that `removed` does not cover.
 *
 * @param source - The interval to cut.
 * @param removed - Intervals to take away.
 * @returns The remaining pieces, sorted. Empty pieces are omitted.
 * @throws {@link TypeError} When `removed` is not an array.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * subtractIntervals(
 *   { start: new Date(0), end: new Date(10) },
 *   [{ start: new Date(2), end: new Date(4) }],
 * ).length; // 2
 */
export function subtractIntervals(
    source: Interval,
    removed: readonly Interval[],
): Interval[] {
    if (!Array.isArray(removed)) {
        throw typeError("removed", "an array of intervals", removed);
    }
    return subtractIntervalList(
        readInterval(source, "source"),
        removed.map((interval, index) =>
            readInterval(interval, `removed[${String(index)}]`),
        ),
    );
}
