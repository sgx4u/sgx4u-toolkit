import type { DateInput } from "../types/date-input.types.js";
import { anniversaryDate } from "../utils/anniversary.utils.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import { readLeapDayPolicy } from "../get-age/get-age.js";
import type { NextAnniversaryOptions } from "./get-next-anniversary.types.js";

/**
 * Returns the start of the next anniversary of a date.
 *
 * When today is the anniversary and `includeToday` is `true`, the result
 * is the start of today. A February 29 date uses the common-year policy.
 *
 * @param date - The original date.
 * @param options - `includeToday` defaults to `true`.
 * @returns A new `Date` at the start of the anniversary day.
 * @throws {@link TypeError} When `date` has the wrong type.
 * @throws {@link RangeError} When a value is invalid.
 * @example
 * getNextAnniversary("2000-02-29", { now: "2021-03-01T12:00:00Z", timeZone: "UTC" }).toISOString(); // "2021-03-01T00:00:00.000Z"
 */
export function getNextAnniversary(
    date: DateInput,
    options?: NextAnniversaryOptions,
): Date {
    const timeZone = resolveTimeZone(options?.timeZone);
    const instant = resolveDateInput(date, "date", timeZone);
    const now = resolveNow(options?.now, timeZone);
    const policy = readLeapDayPolicy(options?.leapDayBirthdayInCommonYears);
    const includeToday = options?.includeToday ?? true;
    const original = readDateParts(instant.getTime(), timeZone);
    const today = readDateParts(now.getTime(), timeZone);
    let year = today.year;
    let anniversary = anniversaryDate(original, year, policy);
    const todayKey = today.year * 10000 + today.month * 100 + today.day;
    const anniversaryKey =
        anniversary.year * 10000 + anniversary.month * 100 + anniversary.day;
    if (
        anniversaryKey < todayKey ||
        (anniversaryKey === todayKey && !includeToday)
    ) {
        year += 1;
        anniversary = anniversaryDate(original, year, policy);
    }
    return new Date(
        instantFromWallTime(
            {
                year: anniversary.year,
                month: anniversary.month,
                day: anniversary.day,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            timeZone,
            "compatible",
        ),
    );
}
