import type { DateInput } from "../types/date-input.types.js";
import { startOfInstant } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { RemoveDuplicateDatesOptions } from "./remove-duplicate-dates.types.js";

/**
 * Returns the first date of each unit, in input order.
 *
 * Later dates that fall in a unit already seen are dropped. The input
 * array is not changed.
 *
 * @param dates - The dates to filter.
 * @param options - `unit` defaults to `"millisecond"`. `timeZone` defaults to the system zone.
 * @returns A new array of new `Date` objects.
 * @throws {@link TypeError} When `dates` is not an array.
 * @throws {@link RangeError} When an entry, the unit, or the zone is invalid.
 * @example
 * removeDuplicateDates(["2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z"]).length; // 1
 */
export function removeDuplicateDates(
    dates: readonly DateInput[],
    options?: RemoveDuplicateDatesOptions,
): Date[] {
    if (!Array.isArray(dates)) {
        throw typeError("dates", "an array of dates", dates);
    }
    const unit = assertTimeUnit(options?.unit ?? "millisecond");
    const timeZone = resolveTimeZone(options?.timeZone);
    const seen = new Set<number>();
    const unique: Date[] = [];
    for (const [index, value] of dates.entries()) {
        const date = resolveDateInput(
            value,
            `dates[${String(index)}]`,
            timeZone,
        );
        const key = startOfInstant(
            date.getTime(),
            unit,
            timeZone,
            resolveWeekStartsOn(undefined),
        );
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        unique.push(date);
    }
    return unique;
}
