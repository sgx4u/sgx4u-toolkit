import type { DateInput } from "../types/date-input.types.js";
import type { Weekday } from "../types/time.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    readDateParts,
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { weekOfMonth } from "../utils/week.utils.js";

/**
 * Fields for {@link getWeekOfMonth}.
 */
export interface GetWeekOfMonthParams {
    /**
     * The date to read.
     */
    date: DateInput;
    /**
     * Zone used to read the calendar day.
     */
    timeZone?: string;
    /**
     * ISO weekday that starts the week.
     */
    weekStartsOn?: Weekday;
}

/**
 * Returns the week of the month, from 1 through 6.
 *
 * The first week is the week that contains day 1, starting on `weekStartsOn`.
 *
 * @param params - `date` is required. `weekStartsOn` defaults to Monday.
 * @returns The week inside that month, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` or `weekStartsOn` is invalid.
 * @example
 * getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" }); // 5
 */
export function getWeekOfMonth({
    date,
    timeZone,
    weekStartsOn,
}: GetWeekOfMonthParams): number | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return weekOfMonth(
        parts.year,
        parts.month,
        parts.day,
        resolveWeekStartsOn(weekStartsOn),
    );
}