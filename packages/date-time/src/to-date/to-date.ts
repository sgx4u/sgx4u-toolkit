import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";

/**
 * Returns a new `Date` for `value`.
 *
 * A `Date` or a millisecond timestamp is that instant. A `YYYY-MM-DD`
 * string is midnight at the start of that day in `options.timeZone`, or
 * in the system zone when the option is omitted. A date-time string with
 * an offset is that exact instant. The input is never mutated, and the
 * result is always a new object.
 *
 * @param value - A `Date`, a millisecond timestamp, or a strict date string.
 * @param options - `timeZone` applies to a date-only string.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `value` is not a `Date`, number, or string.
 * @throws {@link RangeError} When `value` is not a real date, or `timeZone` is not a usable zone.
 * @example
 * toDate("2026-11-26", { timeZone: "Asia/Kolkata" }).toISOString(); // "2026-11-25T18:30:00.000Z"
 */
export function toDate(value: DateInput, options?: TimeZoneOptions): Date {
    return resolveDateInput(value, "value", options?.timeZone);
}
