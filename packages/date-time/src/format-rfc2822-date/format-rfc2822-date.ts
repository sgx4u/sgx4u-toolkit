import { readDateInput } from "../utils/date-input.utils.js";
import { formatRFC2822Text } from "../utils/rfc2822.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatRFC2822DateParams } from "./format-rfc2822-date.types.js";

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
 * @param params - `date` is required. `timeZone` defaults to the system zone.
 * @returns `Thu, 26 Nov 2026 03:30:00 +0530`, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When the zone is unusable.
 * @example
 * formatRFC2822Date({
 *   date: "2026-11-25T22:00:00.000Z",
 *   timeZone: "Asia/Kolkata",
 * }); // "Thu, 26 Nov 2026 03:30:00 +0530"
 */
export function formatRFC2822Date({
    date,
    timeZone,
}: FormatRFC2822DateParams): string | undefined {
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    const parts = readDateParts(resolved.getTime(), zone);
    const weekday = shortWeekdays[parts.weekday - 1] ?? "Thu";
    return formatRFC2822Text(
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
