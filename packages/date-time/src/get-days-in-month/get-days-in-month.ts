import { daysInGregorianMonth } from "../utils/gregorian.utils.js";
import type { GetDaysInMonthParams } from "./get-days-in-month.types.js";

/**
 * Returns the number of days in a Gregorian month.
 *
 * February has 29 days in a leap year and 28 otherwise. `month` is `1`
 * for January through `12` for December.
 *
 * @param params - `year` and `month` name the month to measure.
 * @returns `28`, `29`, `30`, or `31`, or `undefined` when `year` or `month` is not usable.
 * @example
 * getDaysInMonth({ year: 2024, month: 2 }); // 29
 */
export function getDaysInMonth({
    year,
    month,
}: GetDaysInMonthParams): 28 | 29 | 30 | 31 | undefined {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return undefined;
    }
    if (typeof month !== "number" || !Number.isInteger(month)) {
        return undefined;
    }
    if (month < 1 || month > 12) {
        return undefined;
    }
    return daysInGregorianMonth(year, month);
}