import { assertInteger } from "../utils/assert.utils.js";
import { isGregorianLeapYear } from "../utils/gregorian.utils.js";

/**
 * Returns the number of days in a Gregorian year.
 *
 * A leap year has 366 days. Every other year has 365.
 *
 * @param year - The Gregorian year.
 * @returns `366` in a leap year and `365` otherwise.
 * @throws {@link TypeError} When `year` is not a number.
 * @throws {@link RangeError} When `year` is not a finite integer.
 * @example
 * getDaysInYear(1900); // 365
 */
export function getDaysInYear(year: number): 365 | 366 {
    return isGregorianLeapYear(assertInteger(year, "year")) ? 366 : 365;
}
