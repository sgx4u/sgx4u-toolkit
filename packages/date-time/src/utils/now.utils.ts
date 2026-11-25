import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import { resolveDateInput, resolveNow } from "./date-input.utils.js";
import {
    assertDuration,
    isNegativeDuration,
    negatedDuration,
} from "./duration.utils.js";
import { rangeError } from "./error.utils.js";
import { addGregorianDays } from "./gregorian.utils.js";
import { readDateParts, resolveTimeZone } from "./time-zone.utils.js";

/**
 * Wall-clock calendar date of an instant in a zone.
 *
 * @param date - The date to read.
 * @param options - `now` is unused. `timeZone` defaults to the system zone.
 * @param argumentName - The parameter name used in an error.
 * @returns The year, month, and day.
 */
export function calendarDayOf(
    date: DateInput,
    timeZone: string,
    argumentName: string,
): { year: number; month: number; day: number } {
    const instant = resolveDateInput(date, argumentName, timeZone);
    const parts = readDateParts(instant.getTime(), timeZone);
    return { year: parts.year, month: parts.month, day: parts.day };
}

/**
 * Whether `date` falls on the calendar day `dayOffset` away from now.
 *
 * @param date - The date to test.
 * @param dayOffset - `0` is today, `1` is tomorrow, and `-1` is yesterday.
 * @param options - `now` and `timeZone`.
 * @returns `true` when the calendar days match.
 */
export function isOffsetDay(
    date: DateInput,
    dayOffset: number,
    options?: NowOptions & TimeZoneOptions,
): boolean {
    const timeZone = resolveTimeZone(options?.timeZone);
    const now = resolveNow(options?.now, timeZone);
    const today = calendarDayOf(now, timeZone, "now");
    const target = addGregorianDays(
        today.year,
        today.month,
        today.day,
        dayOffset,
    );
    const actual = calendarDayOf(date, timeZone, "date");
    return (
        actual.year === target.year &&
        actual.month === target.month &&
        actual.day === target.day
    );
}

/**
 * The instants that bound an inclusive duration window around now.
 *
 * @param date - The date to test.
 * @param duration - A zero or positive duration.
 * @param options - Now and time zone.
 * @returns The date, now, now minus the duration, and now plus the duration.
 * @throws {@link RangeError} When `duration` is negative.
 */
export function durationWindow(
    date: DateInput,
    duration: Duration,
    options: (NowOptions & TimeZoneOptions) | undefined,
): { instant: number; now: number; earlier: number; later: number } {
    const checked = assertDuration(duration, "duration");
    if (isNegativeDuration(checked)) {
        throw rangeError("duration", "a zero or positive duration", duration);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const current = resolveNow(options?.now, timeZone);
    return {
        instant: resolveDateInput(date, "date", timeZone).getTime(),
        now: current.getTime(),
        earlier: addDuration(current, negatedDuration(checked), {
            timeZone,
        }).getTime(),
        later: addDuration(current, checked, { timeZone }).getTime(),
    };
}
