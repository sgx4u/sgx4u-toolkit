import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { dayOfYear } from "../utils/week.utils.js";

/**
 * Returns the day of the year, from 1 through 366.
 *
 * @param date - The date to read.
 * @param options - `timeZone` defaults to the system zone.
 * @returns The day number in that zone.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getDayOfYear("2024-03-01T00:00:00Z", { timeZone: "UTC" }); // 61
 */
export function getDayOfYear(
    date: DateInput,
    options?: TimeZoneOptions,
): number {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return dayOfYear(parts.year, parts.month, parts.day);
}
