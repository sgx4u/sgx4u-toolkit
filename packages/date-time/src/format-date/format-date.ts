import type { DateInput } from "../types/date-input.types.js";
import type { LocaleOptions, TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { formatWithPattern } from "../utils/format-pattern.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Formats a date with Unicode CLDR field tokens.
 *
 * Text inside single quotes is copied literally, and `''` is one quote.
 * Numeric fields use Latin digits. Month names, weekday names, eras, day
 * periods, and zone names come from `Intl`. An ASCII letter run that is
 * not a supported token throws.
 *
 * @param date - The instant to format.
 * @param pattern - A pattern such as `yyyy-MM-dd HH:mm`.
 * @param options - `timeZone` defaults to the system zone. `locale` defaults to the runtime locale.
 * @returns The formatted text.
 * @throws {@link TypeError} When `pattern` is not a string.
 * @throws {@link RangeError} When `date`, the zone, or a token is invalid.
 * @example
 * formatDate("2026-11-25T22:00:00.000Z", "yyyy-MM-dd HH:mm", { timeZone: "Asia/Kolkata" }); // "2026-11-26 03:30"
 */
export function formatDate(
    date: DateInput,
    pattern: string,
    options?: TimeZoneOptions & LocaleOptions,
): string {
    const timeZone = resolveTimeZone(options?.timeZone);
    const instant = resolveDateInput(date, "date").getTime();
    return formatWithPattern(
        readDateParts(instant, timeZone),
        pattern,
        options?.locale,
        timeZone,
        instant,
    );
}
