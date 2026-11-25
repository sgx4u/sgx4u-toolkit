import type { TimeOfDay } from "../types/time.types.js";
import { typeError } from "../utils/error.utils.js";

/**
 * Compares two times of day.
 *
 * @param first - The first time.
 * @param second - The second time.
 * @returns `-1`, `0`, or `1`.
 * @throws {@link TypeError} When either value is not a time of day.
 * @example
 * compareTimesOfDay({ hour: 9, minute: 0, second: 0, millisecond: 0 }, { hour: 17, minute: 0, second: 0, millisecond: 0 }); // -1
 */
export function compareTimesOfDay(
    first: TimeOfDay,
    second: TimeOfDay,
): -1 | 0 | 1 {
    const firstValue = timeValue(first, "first");
    const secondValue = timeValue(second, "second");
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
 * @param argumentName - The parameter name used in an error.
 * @returns Milliseconds since midnight.
 * @throws {@link TypeError} When `time` is not an object of numbers.
 */
function timeValue(time: TimeOfDay, argumentName: string): number {
    if (time === null || typeof time !== "object") {
        throw typeError(argumentName, "a time of day", time);
    }
    return (
        ((time.hour * 60 + time.minute) * 60 + time.second) * 1_000 +
        time.millisecond
    );
}
