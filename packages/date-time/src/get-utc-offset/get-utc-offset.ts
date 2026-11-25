import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { assertTimeZoneName, readDateParts } from "../utils/time-zone.utils.js";

/**
 * Returns the offset from UTC, in minutes, for an instant in a zone.
 *
 * The value may include a fraction when the historical offset is not a
 * whole minute. Positive means the zone is ahead of UTC.
 *
 * @param date - The instant to measure.
 * @param timeZone - An IANA name or a fixed offset.
 * @returns Minutes east of UTC.
 * @throws {@link TypeError} When `date` or `timeZone` has the wrong type.
 * @throws {@link RangeError} When `date` is not a real date, or `timeZone` is not usable.
 * @example
 * getUtcOffset("2024-06-15T12:00:00Z", "Asia/Kolkata"); // 330
 */
export function getUtcOffset(date: DateInput, timeZone: string): number {
    const instant = resolveDateInput(date, "date");
    const zone = assertTimeZoneName(timeZone, "timeZone");
    return readDateParts(instant.getTime(), zone).offsetMinutes;
}
