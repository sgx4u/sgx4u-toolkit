import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { formatCalendarText } from "../utils/iso.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link formatISODate}.
 */
export interface FormatISODateParams extends TimeZoneOptions {
    /**
     * The instant to format.
     */
    date: DateInput;
}

/**
 * Formats the calendar date in a time zone as `YYYY-MM-DD`.
 *
 * The date is the wall-clock date in the zone, not the UTC date.
 *
 * @param params - `date` is the instant. `timeZone` defaults to the system zone.
 * @returns The calendar date, or `undefined` when `date` is not a real date.
 * @throws {@link RangeError} When `timeZone` is not a usable zone.
 * @throws {@link TypeError} When `timeZone` is not a string.
 * @example
 * formatISODate({ date: "2026-11-25T22:00:00Z", timeZone: "Asia/Kolkata" }); // "2026-11-26"
 */
export function formatISODate({
    date,
    timeZone,
}: FormatISODateParams): string | undefined {
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    const parts = readDateParts(resolved.getTime(), zone);
    return formatCalendarText(parts.year, parts.month, parts.day);
}
