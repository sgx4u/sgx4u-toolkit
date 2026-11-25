import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { isoWeekOfDate } from "../utils/week.utils.js";

/**
 * Returns the year the ISO week belongs to.
 *
 * A date in the last days of December can belong to week 1 of the next
 * year, and the first days of January can belong to the previous year.
 *
 * @param date - The date to read.
 * @param options - `timeZone` defaults to the system zone.
 * @returns The ISO week-year.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getIsoWeekYear("2026-01-01T00:00:00Z", { timeZone: "UTC" }); // 2026
 */
export function getIsoWeekYear(
    date: DateInput,
    options?: TimeZoneOptions,
): number {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return isoWeekOfDate(parts.year, parts.month, parts.day).weekYear;
}
