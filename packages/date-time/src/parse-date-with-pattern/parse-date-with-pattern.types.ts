import type {
    DisambiguationOptions,
    LocaleOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import type { DateInput } from "../types/date-input.types.js";

/**
 * How a patterned date is completed and placed on the timeline.
 */
export interface ParseDateWithPatternOptions
    extends TimeZoneOptions, LocaleOptions, DisambiguationOptions {
    /**
     * Fields missing from the pattern come from this instant. Omitted time
     * fields become zero when the pattern contains a date field.
     *
     * @defaultValue The current time.
     */
    referenceDate?: DateInput;
}
