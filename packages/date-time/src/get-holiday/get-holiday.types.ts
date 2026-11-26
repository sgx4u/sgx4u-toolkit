import type { HolidayRule } from "../types/holiday.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link getHoliday}.
 */
export interface GetHolidayParams extends TimeZoneOptions {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * The holiday rules.
     */
    rules: readonly HolidayRule[];
    /**
     * Match the observed substitute day. When false, only the original date matches.
     *
     * @defaultValue `true`
     */
    matchObservedDate?: boolean;
}