import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import {
    anniversaryDate,
    compareCalendarDates,
} from "../utils/anniversary.utils.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import {
    addGregorianMonths,
    utcEpochMilliseconds,
} from "../utils/gregorian.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { AgeOptions } from "../get-age/get-age.types.js";
import { readLeapDayPolicy } from "../get-age/get-age.js";

/**
 * Returns an age as years, months, and days.
 *
 * The fields are the calendar distance from the birth date to `now` in
 * the zone. A February 29 birthday follows the same common-year rule as
 * `getAge`.
 *
 * @param birthDate - The start of the age.
 * @param options - `now` defaults to the current time.
 * @returns Years, months, and days. Zero fields are omitted.
 * @throws {@link TypeError} When `birthDate` has the wrong type.
 * @throws {@link RangeError} When `birthDate` is after `now`.
 * @example
 * getAgeAsDuration("2020-01-31", { now: "2021-03-01T00:00:00Z", timeZone: "UTC" }); // { years: 1, months: 1, days: 1 }
 */
export function getAgeAsDuration(
    birthDate: DateInput,
    options?: AgeOptions,
): Duration {
    const timeZone = resolveTimeZone(options?.timeZone);
    const birth = resolveDateInput(birthDate, "birthDate", timeZone);
    const now = resolveNow(options?.now, timeZone);
    if (birth.getTime() > now.getTime()) {
        throw rangeError("birthDate", "a date at or before `now`", birthDate);
    }
    const policy = readLeapDayPolicy(options?.leapDayBirthdayInCommonYears);
    const birthParts = readDateParts(birth.getTime(), timeZone);
    const nowParts = readDateParts(now.getTime(), timeZone);
    let years = nowParts.year - birthParts.year;
    const anniversary = anniversaryDate(birthParts, nowParts.year, policy);
    const today = {
        year: nowParts.year,
        month: nowParts.month,
        day: nowParts.day,
    };
    if (compareCalendarDates(today, anniversary) < 0) {
        years -= 1;
    }
    const afterYears = anniversaryDate(
        birthParts,
        birthParts.year + years,
        policy,
    );
    let months = 0;
    let cursor = afterYears;
    while (months < 12) {
        const next = addGregorianMonths(
            cursor.year,
            cursor.month,
            cursor.day,
            1,
            "constrain",
        );
        if (compareCalendarDates(next, today) > 0) {
            break;
        }
        cursor = next;
        months += 1;
    }
    const dayStart = dateNumber(cursor);
    const todayNumber = dateNumber(today);
    const days = Math.round((todayNumber - dayStart) / 86_400_000);
    const duration: Duration = {};
    if (years !== 0) {
        duration.years = years;
    }
    if (months !== 0) {
        duration.months = months;
    }
    if (days !== 0) {
        duration.days = days;
    }
    return duration;
}

/**
 * @param date - A calendar date.
 * @returns UTC midnight of that date, used only to count days.
 */
function dateNumber(date: {
    year: number;
    month: number;
    day: number;
}): number {
    return utcEpochMilliseconds(
        date.year,
        date.month - 1,
        date.day,
        0,
        0,
        0,
        0,
    );
}
