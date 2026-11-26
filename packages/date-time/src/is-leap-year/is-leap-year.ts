import { isGregorianLeapYear } from "../utils/gregorian.utils.js";

/**
 * Reports whether a year has a February 29.
 *
 * The rule is the proleptic Gregorian rule. Year 0 is a leap year. A
 * century year is a leap year only when it is also divisible by 400.
 * A value that is not a finite integer is not a leap year.
 *
 * @param year - The Gregorian year.
 * @returns `true` when February has 29 days.
 * @example
 * isLeapYear(2024); // true
 */
export function isLeapYear(year: number): boolean {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return false;
    }
    return isGregorianLeapYear(year);
}
