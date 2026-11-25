import type { Duration } from "../types/duration.types.js";
import type { Interval } from "../types/interval.types.js";
import { durationBetweenInstants } from "../utils/arithmetic.utils.js";
import { readInterval } from "../utils/interval.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { IntervalDurationOptions } from "./get-interval-duration.types.js";

/**
 * Returns the length of an interval as a duration.
 *
 * Adding the result to `start` with `addDuration` in the same zone gives
 * `end` when the smallest unit is a millisecond.
 *
 * @param interval - The half-open interval.
 * @param options - `largestUnit` defaults to `"day"`.
 * @returns The duration.
 * @throws {@link RangeError} When the interval is invalid.
 * @example
 * getIntervalDuration({ start: new Date(0), end: new Date(90 * 60 * 1000) }); // { hours: 1, minutes: 30 }
 */
export function getIntervalDuration(
    interval: Interval,
    options?: IntervalDurationOptions,
): Duration {
    const checked = readInterval(interval);
    const largest = assertTimeUnit(
        options?.largestUnit ?? "day",
        "largestUnit",
    );
    return durationBetweenInstants(
        checked.end.getTime(),
        checked.start.getTime(),
        resolveTimeZone(options?.timeZone),
        largest,
        "millisecond",
    );
}
