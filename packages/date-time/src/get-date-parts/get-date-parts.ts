import type { DateParts } from "../types/time.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetDatePartsParams } from "./get-date-parts.types.js";

/**
 * Returns the wall-clock fields of an instant in a time zone.
 *
 * Months are `1` through `12`. `weekday` is the ISO number, Monday `1`
 * through Sunday `7`. `offsetMinutes` may include a fraction. A date-only
 * string is midnight in the zone.
 *
 * @param params - `date` is the instant to read; `timeZone` defaults to the system zone.
 * @returns The fields in that zone, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getDateParts({ date: "2024-06-15T16:00:00.000Z", timeZone: "America/New_York" })?.hour; // 12
 */
export function getDateParts({
    date,
    timeZone,
}: GetDatePartsParams): DateParts | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    return readDateParts(instant.getTime(), zone);
}