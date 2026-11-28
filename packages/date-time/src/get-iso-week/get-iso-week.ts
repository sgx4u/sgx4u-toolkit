import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { ISOWeekOfDate } from "../utils/week.utils.js";
import type { GetISOWeekParams } from "./get-iso-week.types.js";

/**
 * Returns the ISO 8601 week number, from 1 through 53.
 *
 * @param params - `date` is the instant to read; `timeZone` defaults to the system zone.
 * @returns The ISO week of the wall-clock date, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getISOWeek({ date: "2026-01-01T00:00:00Z", timeZone: "UTC" }); // 1
 */
export function getISOWeek({
    date,
    timeZone,
}: GetISOWeekParams): number | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return ISOWeekOfDate(parts.year, parts.month, parts.day).week;
}
