import type { DateInput } from "../types/date-input.types.js";
import type { LocaleOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Locale styles passed through to `Intl.DateTimeFormat`.
 */
export interface FormatDateWithStyleOptions
    extends TimeZoneOptions, LocaleOptions {
    /**
     * The date length. Used alone when `timeStyle` is omitted.
     *
     * @defaultValue `"medium"`
     */
    dateStyle?: "full" | "long" | "medium" | "short";
    /**
     * The time length. Omit it to format the date only.
     */
    timeStyle?: "full" | "long" | "medium" | "short";
    /**
     * An `Intl` calendar name, such as `"gregory"`.
     */
    calendar?: string;
    /**
     * An `Intl` numbering system.
     */
    numberingSystem?: string;
    /**
     * The hour cycle passed to `Intl`.
     */
    hourCycle?: "h11" | "h12" | "h23" | "h24";
}

/**
 * Fields for {@link formatDateWithStyle}.
 */
export interface FormatDateWithStyleParams extends FormatDateWithStyleOptions {
    /**
     * The instant to format.
     */
    date: DateInput;
}
