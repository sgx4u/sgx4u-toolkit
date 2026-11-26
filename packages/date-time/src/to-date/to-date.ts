import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link toDate}.
 */
export interface ToDateParams extends TimeZoneOptions {
    /**
     * A `Date`, a millisecond timestamp, or a strict date string.
     */
    date: DateInput;
}

/**
 * Returns a new `Date` for `date`.
 *
 * A `Date` or a millisecond timestamp is that instant. A `YYYY-MM-DD`
 * string is midnight at the start of that day in `timeZone`, or
 * in the system zone when the option is omitted. A date-time string with
 * an offset is that exact instant. The input is never mutated, and the
 * result is always a new object.
 *
 * @param params - `date` is required. `timeZone` applies to a date-only string.
 * @returns A new `Date`, or `undefined` when `date` is not a real date.
 * @throws {@link RangeError} When `timeZone` is not a usable zone.
 * @example
 * toDate({ date: "2026-11-26", timeZone: "Asia/Kolkata" })?.toISOString(); // "2026-11-25T18:30:00.000Z"
 */
export function toDate({ date, timeZone }: ToDateParams): Date | undefined {
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    return new Date(resolved.getTime());
}