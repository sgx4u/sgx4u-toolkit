import type { DateInput } from "../types/date-input.types.js";
import type { LocaleOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link formatDate}.
 */
export interface FormatDateParams extends TimeZoneOptions, LocaleOptions {
    /**
     * The instant to format.
     */
    date: DateInput;
    /**
     * A pattern such as `yyyy-MM-dd HH:mm`.
     */
    pattern: string;
}
