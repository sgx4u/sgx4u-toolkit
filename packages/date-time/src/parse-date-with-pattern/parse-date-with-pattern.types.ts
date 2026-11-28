import type {
    DisambiguationOptions,
    LocaleOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link parseDateWithPattern}.
 */
export interface ParseDateWithPatternParams
    extends TimeZoneOptions, LocaleOptions, DisambiguationOptions {
    /**
     * The text to parse.
     */
    value: string;
    /**
     * The CLDR-style pattern.
     */
    pattern: string;
    /**
     * Fields missing from the pattern come from this instant. Omitted time
     * fields become zero when the pattern contains a date field.
     *
     * @defaultValue The current time.
     */
    referenceDate?: DateInput;
}
