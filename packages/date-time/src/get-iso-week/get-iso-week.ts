import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { isoWeekOfDate } from "../utils/week.utils.js";

/**
 * Returns the ISO 8601 week number, from 1 through 53.
 *
 * @param date - The date to read.
 * @param options - `timeZone` defaults to the system zone.
 * @returns The ISO week of the wall-clock date.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getIsoWeek("2026-01-01T00:00:00Z", { timeZone: "UTC" }); // 1
 */
export function getIsoWeek(date: DateInput, options?: TimeZoneOptions): number {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return isoWeekOfDate(parts.year, parts.month, parts.day).week;
}
