import { assertWorkingDays } from "../utils/business-config.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { IsWeekendParams } from "./is-weekend.types.js";

const defaultWorkingDays = [1, 2, 3, 4, 5] as const;

/**
 * Reports whether a date falls on a weekend day.
 *
 * A weekend day is any ISO weekday not listed in `workingDays`. The default
 * working week is Monday through Friday.
 *
 * @param params - `date` is required. `workingDays` defaults to Monday–Friday.
 * @returns `true` when the ISO weekday is not a working day.
 * @throws {@link TypeError} When `workingDays` is not an array.
 * @throws {@link RangeError} When a working day is outside 1 through 7 or `timeZone` is not usable.
 * @example
 * isWeekend({ date: "2026-11-28T00:00:00Z", timeZone: "UTC" }); // true
 */
export function isWeekend({
    date,
    workingDays,
    timeZone,
}: IsWeekendParams): boolean {
    const zone = resolveTimeZone(timeZone);
    const open =
        workingDays === undefined
            ? defaultWorkingDays
            : assertWorkingDays(workingDays);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return false;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return !open.includes(parts.weekday);
}