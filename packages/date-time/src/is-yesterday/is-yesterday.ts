import type { DateInput } from "../types/date-input.types.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { addGregorianDays } from "../utils/gregorian.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link isYesterday}.
 */
export interface IsYesterdayParams {
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
 * Reports whether a date falls on the calendar day before today.
 *
 * @param params - `date` is required. `now` and `timeZone` default to the current instant and system zone.
 * @returns `true` when `date` is yesterday in the zone.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * isYesterday({ date: "2026-11-25T00:00:00Z", now: "2026-11-26T00:00:00Z", timeZone: "UTC" }); // true
 */
export function isYesterday({
    date,
    now,
    timeZone,
}: IsYesterdayParams): boolean {
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
    const target = addGregorianDays(today.year, today.month, today.day, -1);
    const actual = readDateParts(resolved.getTime(), zone);
    return (
        actual.year === target.year &&
        actual.month === target.month &&
        actual.day === target.day
    );
}
