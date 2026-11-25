import { assertInteger } from "../utils/assert.utils.js";
import { isGregorianLeapYear } from "../utils/gregorian.utils.js";

/**
 * Reports whether a year has a February 29.
 *
 * The rule is the proleptic Gregorian rule. Year 0 is a leap year. A
 * century year is a leap year only when it is also divisible by 400.
 *
 * @param year - The Gregorian year.
 * @returns `true` when February has 29 days.
 * @throws {@link TypeError} When `year` is not a number.
 * @throws {@link RangeError} When `year` is not a finite integer.
 * @example
 * isLeapYear(2024); // true
 */
export function isLeapYear(year: number): boolean {
    return isGregorianLeapYear(assertInteger(year, "year"));
}
