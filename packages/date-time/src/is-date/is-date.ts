import { isDateValue } from "../utils/date-value.utils.js";

/**
 * Reports whether `value` is a `Date` object.
 *
 * A `Date` from another realm counts. An Invalid Date counts too; use
 * `isValidDate` when the instant has to be real. The function does not
 * throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a Date object.
 * @example
 * isDate(new Date(0)); // true
 */
export function isDate(value: unknown): value is Date {
    return isDateValue(value);
}
