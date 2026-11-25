import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { formatCalendarText } from "../utils/iso.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Formats the calendar date in a time zone as `YYYY-MM-DD`.
 *
 * The date is the wall-clock date in the zone, not the UTC date.
 *
 * @param date - The instant to format.
 * @param options - `timeZone` defaults to the system zone.
 * @returns The calendar date.
 * @throws {@link RangeError} When `date` is not a real date or the zone is unusable.
 * @example
 * formatIsoDate("2026-11-25T22:00:00Z", { timeZone: "Asia/Kolkata" }); // "2026-11-26"
 */
export function formatIsoDate(
    date: DateInput,
    options?: TimeZoneOptions,
): string {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return formatCalendarText(parts.year, parts.month, parts.day);
}
