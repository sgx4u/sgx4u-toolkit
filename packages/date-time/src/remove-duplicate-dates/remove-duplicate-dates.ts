import { startOfInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { RemoveDuplicateDatesParams } from "./remove-duplicate-dates.types.js";

/**
 * Returns the first date of each unit, in input order.
 *
 * Later dates that fall in a unit already seen are dropped. The input
 * array is not changed.
 *
 * @param params - `dates` is required. `unit` defaults to `"millisecond"`. `timeZone` defaults to the system zone.
 * @returns A new array of new `Date` objects, or `undefined` when `dates` is not an array or contains an unusable date.
 * @throws {@link RangeError} When `unit` or `timeZone` is invalid.
 * @example
 * removeDuplicateDates({ dates: ["2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z"] })?.length; // 1
 */
export function removeDuplicateDates({
    dates,
    unit: unitInput = "millisecond",
    timeZone,
}: RemoveDuplicateDatesParams): Date[] | undefined {
    if (!Array.isArray(dates)) {
        return undefined;
    }
    const unit = assertTimeUnit(unitInput);
    const zone = resolveTimeZone(timeZone);
    const seen = new Set<number>();
    const unique: Date[] = [];
    for (const value of dates) {
        const date = readDateInput(value, zone);
        if (date === undefined) {
            return undefined;
        }
        const key = startOfInstant(
            date.getTime(),
            unit,
            zone,
            resolveWeekStartsOn(undefined),
        );
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        unique.push(new Date(date.getTime()));
    }
    return unique;
}