import type { ObservancePolicy } from "../types/holiday.types.js";
import type { CalendarDate } from "../types/time.types.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import { observeDate } from "../utils/holiday.utils.js";
import type { ObservedDateOptions } from "./get-observed-date.types.js";

const policies = [
    "none",
    "nearest-weekday",
    "next-weekday",
    "next-monday",
] as const;

/**
 * Returns the substitute day when a holiday falls on a weekend.
 *
 * `"nearest-weekday"` moves Saturday to Friday and Sunday to Monday.
 * `"next-weekday"` moves forward to the next day that is not a weekend.
 * `"next-monday"` moves a weekend holiday to Monday. `"none"` returns the date.
 *
 * @param date - The holiday's calendar date.
 * @param policy - How a weekend holiday moves.
 * @param options - `weekendDays` defaults to Saturday and Sunday.
 * @returns The observed calendar date.
 * @throws {@link RangeError} When `policy` is unknown.
 * @example
 * getObservedDate({ year: 2020, month: 7, day: 4 }, "nearest-weekday"); // { year: 2020, month: 7, day: 3 }
 */
export function getObservedDate(
    date: CalendarDate,
    policy: ObservancePolicy,
    options?: ObservedDateOptions,
): CalendarDate {
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
    return observeDate(date, policy, options?.weekendDays ?? [6, 7]);
}
