import type { DateInput } from "../types/date-input.types.js";
import type { Weekday } from "../types/time.types.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { addGregorianDays } from "../utils/gregorian.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { WeekdayStepOptions } from "./get-next-weekday.types.js";

/**
 * Returns the start of the next day that falls on `weekday`.
 *
 * @param date - The date to step from.
 * @param weekday - ISO weekday, Monday `1` through Sunday `7`.
 * @param options - `includeCurrentDay` defaults to `false`.
 * @returns A new `Date` at the start of that day in the zone.
 * @throws {@link TypeError} When `date` or `weekday` has the wrong type.
 * @throws {@link RangeError} When a value is invalid.
 * @example
 * getNextWeekday("2026-11-26T15:00:00Z", 1, { timeZone: "UTC" }).toISOString(); // "2026-11-30T00:00:00.000Z"
 */
export function getNextWeekday(
    date: DateInput,
    weekday: Weekday,
    options?: WeekdayStepOptions,
): Date {
    return stepToWeekday(date, weekday, options, 1);
}

/**
 * @param date - The date to step from.
 * @param weekday - The target weekday.
 * @param options - Include-current and time zone options.
 * @param direction - `1` moves forward and `-1` moves backward.
 * @returns The start of the chosen day.
 */
export function stepToWeekday(
    date: DateInput,
    weekday: Weekday,
    options: WeekdayStepOptions | undefined,
    direction: 1 | -1,
): Date {
    const checkedWeekday = assertIntegerInRange(
        weekday,
        "weekday",
        1,
        7,
    ) as Weekday;
    const timeZone = resolveTimeZone(options?.timeZone);
    const instant = resolveDateInput(date, "date", timeZone);
    const parts = readDateParts(instant.getTime(), timeZone);
    let distance =
        direction === 1
            ? (checkedWeekday - parts.weekday + 7) % 7
            : (parts.weekday - checkedWeekday + 7) % 7;
    if (distance === 0 && options?.includeCurrentDay !== true) {
        distance = 7;
    }
    const target = addGregorianDays(
        parts.year,
        parts.month,
        parts.day,
        direction * distance,
    );
    return new Date(
        instantFromWallTime(
            {
                year: target.year,
                month: target.month,
                day: target.day,
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
