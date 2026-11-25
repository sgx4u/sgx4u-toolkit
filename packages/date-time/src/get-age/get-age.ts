import type { DateInput } from "../types/date-input.types.js";
import type { LeapDayBirthday } from "./get-age.types.js";
import {
    anniversaryDate,
    compareCalendarDates,
} from "../utils/anniversary.utils.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { AgeOptions } from "./get-age.types.js";

/**
 * Returns the number of completed years since a birth date.
 *
 * The count uses calendar days in the zone. A February 29 birthday is
 * reached on March 1 in a common year unless the option says February 28.
 *
 * @param birthDate - The start of the age.
 * @param options - `now` defaults to the current time. `leapDayBirthdayInCommonYears` defaults to `"march-1"`.
 * @returns Completed years. Zero when the birthday has not happened yet this year.
 * @throws {@link TypeError} When `birthDate` has the wrong type.
 * @throws {@link RangeError} When `birthDate` is after `now`, or a value is invalid.
 * @example
 * getAge("2000-02-29", { now: "2021-03-01T00:00:00Z", timeZone: "UTC" }); // 21
 */
export function getAge(birthDate: DateInput, options?: AgeOptions): number {
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
