import type { Duration } from "../types/duration.types.js";
import type { Interval } from "../types/interval.types.js";
import { durationBetweenInstants } from "../utils/arithmetic.utils.js";
import { readInterval } from "../utils/interval.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { GetIntervalDurationParams } from "./get-interval-duration.types.js";

/**
 * Returns the length of an interval as a duration.
 *
 * Adding the result to `start` with `addDuration` in the same zone gives
 * `end` when the smallest unit is a millisecond.
 *
 * @param params - `largestUnit` defaults to `"day"`.
 * @returns The duration, or `undefined` when the interval is not usable.
 * @throws {@link RangeError} When `largestUnit` is unknown or `timeZone` is not usable.
 * @example
 * getIntervalDuration({ interval: { start: new Date(0), end: new Date(90 * 60 * 1000) } }); // { hours: 1, minutes: 30 }
 */
export function getIntervalDuration({
    interval,
    timeZone,
    largestUnit = "day",
}: GetIntervalDurationParams): Duration | undefined {
    const checked = checkedInterval(interval);
    if (checked === undefined) {
        return undefined;
    }
    const largest = assertTimeUnit(largestUnit, "largestUnit");
    return durationBetweenInstants(
        checked.end.getTime(),
        checked.start.getTime(),
        resolveTimeZone(timeZone),
        largest,
        "millisecond",
    );
}

/**
 * @param value - A candidate interval.
 * @returns A checked interval, or `undefined` when it is not usable.
 */
function checkedInterval(value: unknown): Interval | undefined {
    try {
        return readInterval(value);
    } catch {
        return undefined;
    }
}