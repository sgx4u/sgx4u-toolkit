import { assertInteger } from "../utils/assert.utils.js";
import { isoWeeksInYear } from "../utils/week.utils.js";

/**
 * Returns the number of ISO weeks in a year.
 *
 * @param year - The Gregorian year.
 * @returns `53` when the year has an ISO week 53, otherwise `52`.
 * @throws {@link TypeError} When `year` is not a number.
 * @throws {@link RangeError} When `year` is not an integer.
 * @example
 * getIsoWeeksInYear(2020); // 53
 */
export function getIsoWeeksInYear(year: number): 52 | 53 {
    return isoWeeksInYear(assertInteger(year, "year"));
}
