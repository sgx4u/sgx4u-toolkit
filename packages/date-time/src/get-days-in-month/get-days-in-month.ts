import { assertInteger, assertIntegerInRange } from "../utils/assert.utils.js";
import { daysInGregorianMonth } from "../utils/gregorian.utils.js";

/**
 * Returns the number of days in a Gregorian month.
 *
 * February has 29 days in a leap year and 28 otherwise. `month` is `1`
 * for January through `12` for December.
 *
 * @param year - The Gregorian year.
 * @param month - The month, from 1 through 12.
 * @returns `28`, `29`, `30`, or `31`.
 * @throws {@link TypeError} When `year` or `month` is not a number.
 * @throws {@link RangeError} When `year` is not an integer, or `month` is outside 1 through 12.
 * @example
 * getDaysInMonth(2024, 2); // 29
 */
export function getDaysInMonth(year: number, month: number): number {
    const yearNumber = assertInteger(year, "year");
    const monthNumber = assertIntegerInRange(month, "month", 1, 12);
    return daysInGregorianMonth(yearNumber, monthNumber);
}
