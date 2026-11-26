import type { DateInput } from "../types/date-input.types.js";
import type { Interval } from "../types/interval.types.js";
import { typeError } from "../utils/error.utils.js";
import { readInterval, subtractIntervalList } from "../utils/interval.utils.js";

/**
 * Fields for {@link subtractIntervals}.
 */
export interface SubtractIntervalsParams {
    /**
     * The inclusive start of the interval to cut.
     */
    start: DateInput;
    /**
     * The exclusive end of the interval to cut.
     */
    end: DateInput;
    /**
     * Intervals to take away from `start` through `end`.
     */
    removed: readonly Interval[];
}

/**
 * Returns the parts of the source interval that `removed` does not cover.
 *
 * @param params - `start`, `end`, and `removed` are required.
 * @returns The remaining pieces, sorted. Empty pieces are omitted.
 * @throws {@link TypeError} When `removed` is not an array.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * subtractIntervals({
 *   start: new Date(0),
 *   end: new Date(10),
 *   removed: [{ start: new Date(2), end: new Date(4) }],
 * }).length; // 2
 */
export function subtractIntervals({
    start,
    end,
    removed,
}: SubtractIntervalsParams): Interval[] {
    if (!Array.isArray(removed)) {
        throw typeError("removed", "an array of intervals", removed);
    }
    return subtractIntervalList(
        readInterval({ start, end }, "interval"),
        removed.map((interval, index) =>
            readInterval(interval, `removed[${String(index)}]`),
        ),
    );
}