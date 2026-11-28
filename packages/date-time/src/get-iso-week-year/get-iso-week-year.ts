import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { ISOWeekOfDate } from "../utils/week.utils.js";
import type { GetISOWeekYearParams } from "./get-iso-week-year.types.js";

/**
 * Returns the year the ISO week belongs to.
 *
 * A date in the last days of December can belong to week 1 of the next
 * year, and the first days of January can belong to the previous year.
 *
 * @param params - `date` is the instant to read; `timeZone` defaults to the system zone.
 * @returns The ISO week-year, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getISOWeekYear({ date: "2026-01-01T00:00:00Z", timeZone: "UTC" }); // 2026
 */
export function getISOWeekYear({
    date,
    timeZone,
}: GetISOWeekYearParams): number | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return ISOWeekOfDate(parts.year, parts.month, parts.day).weekYear;
}
