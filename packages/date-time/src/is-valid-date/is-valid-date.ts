import { isRealDate } from "../utils/date-input.utils.js";

/**
 * Reports whether `value` is a real date.
 *
 * Call this before using a `Date`, a millisecond timestamp, or a date
 * string that may be missing or malformed. Ordinary invalid input returns
 * `false`. The function does not throw for those values.
 *
 * A `Date` is valid when its time value is finite, including a `Date`
 * created in another realm. A `number` is Unix time in milliseconds and
 * is valid on the range `-8640000000000000` through `8640000000000000`.
 * A string is valid when it is a real `YYYY-MM-DD` calendar date, or a
 * date-time with an explicit `Z`, `±HH:mm`, or `±HHmm` offset and in-range
 * clock fields. `2024-02-30` is invalid.
 *
 * @param value - A `Date`, a millisecond timestamp, a date string, or any other value.
 * @returns `true` when `value` is a real date.
 * @example
 * isValidDate("2024-02-29T00:00:00+0530"); // true
 */
export function isValidDate(value: unknown): boolean {
    return isRealDate(value);
}
