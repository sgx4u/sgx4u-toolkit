import type { ObservancePolicy } from "../types/holiday.types.js";
import type { CalendarDate, Weekday } from "../types/time.types.js";
import { assertWorkingDays } from "../utils/business-config.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import { observeDate } from "../utils/holiday.utils.js";
import type { GetObservedDateParams } from "./get-observed-date.types.js";

const policies = [
    "none",
    "nearest-weekday",
    "next-weekday",
    "next-monday",
] as const;

const defaultWorkingDays = [1, 2, 3, 4, 5] as const;

/**
 * Returns the substitute day when a holiday falls on a weekend.
 *
 * `"nearest-weekday"` moves Saturday to Friday and Sunday to Monday.
 * `"next-weekday"` moves forward to the next day that is not a weekend.
 * `"next-monday"` moves a weekend holiday to Monday. `"none"` returns the date.
 *
 * @param params - `date` and `policy` are required. `workingDays` defaults to Monday–Friday.
 * @returns The observed calendar date.
 * @throws {@link RangeError} When `policy` is unknown.
 * @throws {@link TypeError} When `date` is not a calendar date or `workingDays` is not an array.
 * @example
 * getObservedDate({ date: { year: 2020, month: 7, day: 4 }, policy: "nearest-weekday" }); // { year: 2020, month: 7, day: 3 }
 */
export function getObservedDate({
    date,
    policy,
    workingDays,
}: GetObservedDateParams): CalendarDate {
    if (!(policies as readonly string[]).includes(policy)) {
        throw rangeError("policy", "an observance policy", policy);
    }
    if (
        typeof date !== "object" ||
        date === null ||
        !Number.isInteger(date.year) ||
        !Number.isInteger(date.month) ||
        !Number.isInteger(date.day)
    ) {
        throw typeError("date", "a calendar date", date);
    }
    const open =
        workingDays === undefined
            ? defaultWorkingDays
            : assertWorkingDays(workingDays);
    const weekendDays = weekendFromWorkingDays(open);
    return observeDate(
        date,
        policy as ObservancePolicy,
        weekendDays as Weekday[],
    );
}

/**
 * @param workingDays - Days the business is open.
 * @returns Weekdays 1–7 that are not working days.
 */
function weekendFromWorkingDays(
    workingDays: readonly number[],
): readonly number[] {
    const weekend: number[] = [];
    for (const day of [1, 2, 3, 4, 5, 6, 7] as const) {
        if (!workingDays.includes(day)) {
            weekend.push(day);
        }
    }
    return weekend;
}
