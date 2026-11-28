import type { HolidayRule } from "../types/holiday.types.js";

/**
 * Fields for {@link getHolidaysInYear}.
 */
export interface GetHolidaysInYearParams {
    /**
     * The Gregorian year.
     */
    year: number;
    /**
     * The rules to expand.
     */
    rules: readonly HolidayRule[];
}
