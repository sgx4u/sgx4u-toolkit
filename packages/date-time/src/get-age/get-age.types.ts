import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Where a February 29 anniversary falls in a common year.
 */
export type LeapDayBirthday = "february-28" | "march-1";

/**
 * Fields for {@link getAge} and {@link getAgeAsDuration}.
 */
export interface GetAgeParams extends NowOptions, TimeZoneOptions {
    /**
     * The start of the age.
     */
    birthDate: DateInput;
    /**
     * Where a February 29 birthday is reached in a common year.
     *
     * @defaultValue `"march-1"`
     */
    leapDayBirthdayInCommonYears?: LeapDayBirthday;
}

/**
 * Options for an age or anniversary without the birth date field.
 */
export type AgeOptions = Omit<GetAgeParams, "birthDate">;
