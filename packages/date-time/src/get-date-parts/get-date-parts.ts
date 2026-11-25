import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { DateParts } from "../types/time.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the wall-clock fields of an instant in a time zone.
 *
 * Months are `1` through `12`. `weekday` is the ISO number, Monday `1`
 * through Sunday `7`. `offsetMinutes` may include a fraction. A date-only
 * string is midnight in the zone.
 *
 * @param date - The instant to read.
 * @param options - `timeZone` defaults to the system zone.
 * @returns The fields in that zone.
 * @throws {@link TypeError} When `date` has the wrong type.
 * @throws {@link RangeError} When `date` is not a real date, or `timeZone` is not usable.
 * @example
 * getDateParts("2024-06-15T16:00:00.000Z", { timeZone: "America/New_York" }).hour; // 12
 */
export function getDateParts(
    date: DateInput,
    options?: TimeZoneOptions,
): DateParts {
    const instant = resolveDateInput(date, "date", options?.timeZone);
    return readDateParts(instant.getTime(), resolveTimeZone(options?.timeZone));
}
