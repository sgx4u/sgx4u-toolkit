import { ISOWeeksInYear } from "../utils/week.utils.js";

/**
 * Returns the number of ISO weeks in a year.
 *
 * @param year - The Gregorian year.
 * @returns `53` when the year has an ISO week 53, otherwise `52`, or `undefined` when `year` is not an integer.
 * @example
 * getISOWeeksInYear(2020); // 53
 */
export function getISOWeeksInYear(year: number): 52 | 53 | undefined {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return undefined;
    }
    return ISOWeeksInYear(year);
}