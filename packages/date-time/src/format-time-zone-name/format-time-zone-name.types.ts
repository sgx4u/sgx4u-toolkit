import type { DateInput } from "../types/date-input.types.js";
import type { LocaleOptions } from "../types/options.types.js";

/**
 * How a time zone name is written.
 */
export interface FormatTimeZoneNameOptions extends LocaleOptions {
    /**
     * The `Intl` time zone name style.
     *
     * @defaultValue `"long"`
     */
    style?:
        | "long"
        | "short"
        | "shortOffset"
        | "longOffset"
        | "shortGeneric"
        | "longGeneric";
    /**
     * The instant at which the name is read. Names can change with daylight saving.
     *
     * @defaultValue The current time.
     */
    at?: DateInput;
}

/**
 * Fields for {@link formatTimeZoneName}.
 */
export interface FormatTimeZoneNameParams extends FormatTimeZoneNameOptions {
    /**
     * An IANA name or a fixed offset.
     */
    timeZone: string;
}
