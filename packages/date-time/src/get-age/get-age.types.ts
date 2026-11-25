import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Where a February 29 anniversary falls in a common year.
 */
export type LeapDayBirthday = "february-28" | "march-1";

/**
 * Options for an age or anniversary.
 */
export interface AgeOptions extends NowOptions, TimeZoneOptions {
    /**
     * Where a February 29 birthday is reached in a common year.
     *
     * @defaultValue `"march-1"`
     */
    leapDayBirthdayInCommonYears?: LeapDayBirthday;
}
