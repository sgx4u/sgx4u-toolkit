import type { TimeOfDay } from "../types/time.types.js";
import type { CompareTimesOfDayParams } from "./compare-times-of-day.types.js";

/**
 * Compares two times of day.
 *
 * @param params - `first` and `second` are the times to order.
 * @returns `-1`, `0`, or `1`, or `undefined` when either value is not a time of day.
 * @example
 * compareTimesOfDay({
 *   first: { hour: 9, minute: 0, second: 0, millisecond: 0 },
 *   second: { hour: 17, minute: 0, second: 0, millisecond: 0 },
 * }); // -1
 */
export function compareTimesOfDay({
    first,
    second,
}: CompareTimesOfDayParams): -1 | 0 | 1 | undefined {
    const firstValue = readTimeValue(first);
    const secondValue = readTimeValue(second);
    if (firstValue === undefined || secondValue === undefined) {
        return undefined;
    }
    if (firstValue < secondValue) {
        return -1;
    }
    if (firstValue > secondValue) {
        return 1;
    }
    return 0;
}

/**
 * @param time - A candidate time of day.
 * @returns Milliseconds since midnight, or `undefined` when `time` is not usable.
 */
function readTimeValue(time: TimeOfDay): number | undefined {
    if (time === null || typeof time !== "object") {
        return undefined;
    }
    if (
        !Number.isFinite(time.hour) ||
        !Number.isFinite(time.minute) ||
        !Number.isFinite(time.second) ||
        !Number.isFinite(time.millisecond)
    ) {
        return undefined;
    }
    return (
        ((time.hour * 60 + time.minute) * 60 + time.second) * 1_000 +
        time.millisecond
    );
}
