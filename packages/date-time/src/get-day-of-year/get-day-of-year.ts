import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { dayOfYear } from "../utils/week.utils.js";
import type { GetDayOfYearParams } from "./get-day-of-year.types.js";

/**
 * Returns the day of the year, from 1 through 366.
 *
 * @param params - `date` is the instant to read; `timeZone` defaults to the system zone.
 * @returns The day number in that zone, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getDayOfYear({ date: "2024-03-01T00:00:00Z", timeZone: "UTC" }); // 61
 */
export function getDayOfYear({
    date,
    timeZone,
}: GetDayOfYearParams): number | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return dayOfYear(parts.year, parts.month, parts.day);
}
