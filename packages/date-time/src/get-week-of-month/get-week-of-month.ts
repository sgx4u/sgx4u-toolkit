import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    readDateParts,
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { weekOfMonth } from "../utils/week.utils.js";

/**
 * Returns the week of the month, from 1 through 6.
 *
 * The first week is the week that contains day 1, starting on `weekStartsOn`.
 *
 * @param date - The date to read.
 * @param options - `weekStartsOn` defaults to Monday.
 * @returns The week inside that month.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getWeekOfMonth("2026-11-26T00:00:00Z", { timeZone: "UTC" }); // 5
 */
export function getWeekOfMonth(
    date: DateInput,
    options?: TimeZoneOptions & WeekOptions,
): number {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return weekOfMonth(
        parts.year,
        parts.month,
        parts.day,
        resolveWeekStartsOn(options?.weekStartsOn),
    );
}
