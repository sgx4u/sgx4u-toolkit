import type { Interval } from "../types/interval.types.js";
import { isIntervalValue } from "../utils/interval.utils.js";

/**
 * Reports whether a value is a half-open interval.
 *
 * Both sides must be real dates and `end` must not be before `start`.
 * The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is an interval.
 * @example
 * isValidInterval({ start: new Date(0), end: new Date(1) }); // true
 */
export function isValidInterval(value: unknown): value is Interval {
    return isIntervalValue(value);
}
