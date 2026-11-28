import type { Duration } from "../types/duration.types.js";
import { isDurationValue } from "../utils/duration.utils.js";

/**
 * Reports whether a value is a duration.
 *
 * Known fields must be finite numbers and share one sign. The empty object
 * is a zero duration. A fraction is allowed only on the smallest non-zero
 * clock field. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a duration.
 * @example
 * isValidDuration({ hours: 1, minutes: 30 }); // true
 */
export function isValidDuration(value: unknown): value is Duration {
    return isDurationValue(value);
}
