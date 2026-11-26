import { assertIntegerInRange } from "../utils/assert.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    readDateParts,
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { weekOfDate } from "../utils/week.utils.js";
import type { GetWeekOfYearParams } from "./get-week-of-year.types.js";

/**
 * Returns a locale-style week number.
 *
 * Week 1 is the first week, starting on `weekStartsOn`, that contains at
 * least `minimumDaysInFirstWeek` days of the year. Monday and `4` match
 * the ISO week.
 *
 * @param params - `date` is required. `weekStartsOn` defaults to Monday and `minimumDaysInFirstWeek` to `1`.
 * @returns The week number, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `minimumDaysInFirstWeek` is outside 1 through 7.
 * @example
 * getWeekOfYear({
 *   date: "2026-01-01T00:00:00Z",
 *   timeZone: "UTC",
 *   weekStartsOn: 1,
 *   minimumDaysInFirstWeek: 4,
 * }); // 1
 */
export function getWeekOfYear({
    date,
    timeZone,
    weekStartsOn,
    minimumDaysInFirstWeek,
}: GetWeekOfYearParams): number | undefined {
    const minimumDays = assertIntegerInRange(
        minimumDaysInFirstWeek ?? 1,
        "minimumDaysInFirstWeek",
        1,
        7,
    );
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return weekOfDate(
        parts.year,
        parts.month,
        parts.day,
        resolveWeekStartsOn(weekStartsOn),
        minimumDays,
    ).week;
}