import type { LeapDayBirthday } from "./get-age.types.js";
import {
    anniversaryDate,
    compareCalendarDates,
} from "../utils/anniversary.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetAgeParams } from "./get-age.types.js";

/**
 * Returns the number of completed years since a birth date.
 *
 * The count uses calendar days in the zone. A February 29 birthday is
 * reached on March 1 in a common year unless the option says February 28.
 *
 * @param params - `birthDate` is the start; `now` defaults to the current time.
 * @returns Completed years, or `undefined` when the inputs are not usable.
 * @throws {@link RangeError} When `leapDayBirthdayInCommonYears` is unknown, or `timeZone` is not usable.
 * @example
 * getAge({ birthDate: "2000-02-29", now: "2021-03-01T00:00:00Z", timeZone: "UTC" }); // 21
 */
export function getAge({
    birthDate,
    now,
    timeZone,
    leapDayBirthdayInCommonYears,
}: GetAgeParams): number | undefined {
    const zone = resolveTimeZone(timeZone);
    const birth = readDateInput(birthDate, zone);
    const reference = readNow(now, zone);
    if (birth === undefined || reference === undefined) {
        return undefined;
    }
    if (birth.getTime() > reference.getTime()) {
        return undefined;
    }
    const policy = readLeapDayPolicy(leapDayBirthdayInCommonYears);
    const birthParts = readDateParts(birth.getTime(), zone);
    const nowParts = readDateParts(reference.getTime(), zone);
    let years = nowParts.year - birthParts.year;
    const anniversary = anniversaryDate(birthParts, nowParts.year, policy);
    if (
        compareCalendarDates(
            { year: nowParts.year, month: nowParts.month, day: nowParts.day },
            anniversary,
        ) < 0
    ) {
        years -= 1;
    }
    return years;
}

/**
 * @param value - The caller's leap-day policy.
 * @returns `"march-1"` when the option is omitted.
 * @throws {@link RangeError} When the value is not one of the two policies.
 */
export function readLeapDayPolicy(
    value: LeapDayBirthday | undefined,
): LeapDayBirthday {
    if (value === undefined) {
        return "march-1";
    }
    if (value !== "march-1" && value !== "february-28") {
        throw rangeError(
            "leapDayBirthdayInCommonYears",
            `"march-1" or "february-28"`,
            value,
        );
    }
    return value;
}

/**
 * @param now - An optional override for the current instant.
 * @param timeZone - Zone for a date-only override.
 * @returns The reference instant.
 */
function readNow(now: unknown, timeZone: string): Date | undefined {
    if (now === undefined) {
        return new Date(Date.now());
    }
    return readDateInput(now, timeZone);
}