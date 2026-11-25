import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { formatRfc2822Text } from "../utils/rfc2822.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

const shortWeekdays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
] as const;

/**
 * Formats a date as an RFC 2822 date with a numeric offset.
 *
 * @param date - The instant to format.
 * @param options - `timeZone` defaults to the system zone.
 * @returns `Thu, 26 Nov 2026 03:30:00 +0530`.
 * @throws {@link RangeError} When `date` is not a real date or the zone is unusable.
 * @example
 * formatRfc2822Date("2026-11-25T22:00:00.000Z", { timeZone: "Asia/Kolkata" }); // "Thu, 26 Nov 2026 03:30:00 +0530"
 */
export function formatRfc2822Date(
    date: DateInput,
    options?: TimeZoneOptions,
): string {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date").getTime(),
        timeZone,
    );
    const weekday = shortWeekdays[parts.weekday - 1] ?? "Thu";
    return formatRfc2822Text(
        weekday,
        parts.day,
        parts.month,
        parts.year,
        parts.hour,
        parts.minute,
        parts.second,
        parts.offsetMinutes,
    );
}
