import type { DateInput } from "../types/date-input.types.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link isToday}.
 */
export interface IsTodayParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * The instant to use instead of the current time.
     */
    now?: DateInput;
    /**
     * Zone used to read calendar days.
     */
    timeZone?: string;
}

/**
 * Reports whether a date falls on today's calendar day in a time zone.
 *
 * @param params - `date` is required. `now` and `timeZone` default to the current instant and system zone.
 * @returns `true` when the calendar days match.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * isToday({ date: "2026-11-26T23:00:00Z", now: "2026-11-26T01:00:00Z", timeZone: "UTC" }); // true
 */
export function isToday({ date, now, timeZone }: IsTodayParams): boolean {
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return false;
    }
    const reference =
        now === undefined
            ? resolveNow(undefined, zone)
            : readDateInput(now, zone);
    if (reference === undefined) {
        return false;
    }
    const today = readDateParts(reference.getTime(), zone);
    const actual = readDateParts(resolved.getTime(), zone);
    return (
        actual.year === today.year &&
        actual.month === today.month &&
        actual.day === today.day
    );
}
