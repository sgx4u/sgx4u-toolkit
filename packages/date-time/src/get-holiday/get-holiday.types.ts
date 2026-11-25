import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * How a date is matched against a holiday.
 */
export interface HolidayMatchOptions extends TimeZoneOptions {
    /**
     * Match the observed substitute day. When false, only the original date matches.
     *
     * @defaultValue `true`
     */
    matchObservedDate?: boolean;
}
