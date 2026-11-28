import { isGregorianLeapYear } from "../utils/gregorian.utils.js";

/**
 * Returns the number of days in a Gregorian year.
 *
 * A leap year has 366 days. Every other year has 365.
 *
 * @param year - The Gregorian year.
 * @returns `366` in a leap year, `365` otherwise, or `undefined` when `year` is not an integer.
 * @example
 * getDaysInYear(1900); // 365
 */
export function getDaysInYear(year: number): 365 | 366 | undefined {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return undefined;
    }
    return isGregorianLeapYear(year) ? 366 : 365;
}
