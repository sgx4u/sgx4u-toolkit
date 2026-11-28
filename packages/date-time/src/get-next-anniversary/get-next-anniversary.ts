import { anniversaryDate } from "../utils/anniversary.utils.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import { readLeapDayPolicy } from "../get-age/get-age.js";
import type { GetNextAnniversaryParams } from "./get-next-anniversary.types.js";

/**
 * Returns the start of the next anniversary of a date.
 *
 * When today is the anniversary and `includeToday` is `true`, the result
 * is the start of today. A February 29 date uses the common-year policy.
 *
 * @param params - `date` is required. `includeToday` defaults to `true`.
 * @returns A new `Date` at the start of the anniversary day, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` or leap-day policy options are invalid.
 * @example
 * getNextAnniversary({
 *   date: "2000-02-29",
 *   now: "2021-03-01T12:00:00Z",
 *   timeZone: "UTC",
 * })?.toISOString(); // "2021-03-01T00:00:00.000Z"
 */
export function getNextAnniversary({
    date,
    now,
    timeZone,
    leapDayBirthdayInCommonYears,
    includeToday = true,
}: GetNextAnniversaryParams): Date | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const reference =
        now === undefined
            ? resolveNow(undefined, zone)
            : readDateInput(now, zone);
    if (reference === undefined) {
        return undefined;
    }
    const policy = readLeapDayPolicy(leapDayBirthdayInCommonYears);
    const original = readDateParts(instant.getTime(), zone);
    const today = readDateParts(reference.getTime(), zone);
    let year = today.year;
    let anniversary = anniversaryDate(original, year, policy);
    const todayKey = today.year * 10_000 + today.month * 100 + today.day;
    const anniversaryKey =
        anniversary.year * 10_000 + anniversary.month * 100 + anniversary.day;
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
            zone,
            "compatible",
        ),
    );
}
