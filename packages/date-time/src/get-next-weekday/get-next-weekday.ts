import type { Weekday } from "../types/time.types.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { addGregorianDays } from "../utils/gregorian.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { GetNextWeekdayParams } from "./get-next-weekday.types.js";

/**
 * Returns the start of the next day that falls on `weekday`.
 *
 * @param params - `date` and `weekday` are required. `includeCurrentDay` defaults to `false`.
 * @returns A new `Date` at the start of that day in the zone, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `weekday` is outside 1 through 7 or `timeZone` is invalid.
 * @example
 * getNextWeekday({
 *   date: "2026-11-26T15:00:00Z",
 *   weekday: 1,
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-30T00:00:00.000Z"
 */
export function getNextWeekday(
    params: GetNextWeekdayParams,
): Date | undefined {
    return stepToWeekday(params, 1);
}

/**
 * @param params - Date, weekday, and zone options.
 * @param direction - `1` moves forward and `-1` moves backward.
 * @returns The start of the chosen day, or `undefined` when `date` is not usable.
 */
export function stepToWeekday(
    params: GetNextWeekdayParams,
    direction: 1 | -1,
): Date | undefined {
    const checkedWeekday = assertIntegerInRange(
        params.weekday,
        "weekday",
        1,
        7,
    ) as Weekday;
    const timeZone = resolveTimeZone(params.timeZone);
    const instant = readDateInput(params.date, timeZone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), timeZone);
    let distance =
        direction === 1
            ? (checkedWeekday - parts.weekday + 7) % 7
            : (parts.weekday - checkedWeekday + 7) % 7;
    if (distance === 0 && params.includeCurrentDay !== true) {
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