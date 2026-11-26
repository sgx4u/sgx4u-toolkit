import { readDateInput } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { formatWithPattern } from "../utils/format-pattern.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatDateParams } from "./format-date.types.js";

/**
 * Formats a date with Unicode CLDR field tokens.
 *
 * Text inside single quotes is copied literally, and `''` is one quote.
 * Numeric fields use Latin digits. Month names, weekday names, eras, day
 * periods, and zone names come from `Intl`. An ASCII letter run that is
 * not a supported token throws.
 *
 * @param params - `date` and `pattern` are required. `timeZone` defaults to the system zone and `locale` to the runtime locale.
 * @returns The formatted text, or `undefined` when `date` is not usable.
 * @throws {@link TypeError} When `pattern` is not a string.
 * @throws {@link RangeError} When the zone or a token is invalid.
 * @example
 * formatDate({
 *   date: "2026-11-25T22:00:00.000Z",
 *   pattern: "yyyy-MM-dd HH:mm",
 *   timeZone: "Asia/Kolkata",
 * }); // "2026-11-26 03:30"
 */
export function formatDate({
    date,
    pattern,
    timeZone,
    locale,
}: FormatDateParams): string | undefined {
    if (typeof pattern !== "string") {
        throw typeError("pattern", "a string", pattern);
    }
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    const instant = resolved.getTime();
    return formatWithPattern(
        readDateParts(instant, zone),
        pattern,
        locale,
        zone,
        instant,
    );
}
