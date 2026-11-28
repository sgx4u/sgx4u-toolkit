import type { HolidayRule } from "../types/holiday.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * How a date is matched against a holiday.
 */
export interface CreateHolidayPredicateOptions extends TimeZoneOptions {
    /**
     * Match the observed substitute day. When false, only the original date matches.
     *
     * @defaultValue `true`
     */
    matchObservedDate?: boolean;
}

/**
 * Fields for {@link createHolidayPredicate}.
 */
export interface CreateHolidayPredicateParams extends CreateHolidayPredicateOptions {
    /**
     * The holiday rules.
     */
    rules: readonly HolidayRule[];
}
