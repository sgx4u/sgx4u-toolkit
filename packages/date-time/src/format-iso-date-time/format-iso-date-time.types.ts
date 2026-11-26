import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * How much of an ISO date-time to write.
 */
export interface FormatISODateTimeOptions extends TimeZoneOptions {
    /**
     * The smallest field written after the minute.
     *
     * @defaultValue `"millisecond"`
     */
    precision?: "minute" | "second" | "millisecond";
    /**
     * Whether to append `[zone]` for an IANA time zone.
     *
     * @defaultValue `false`
     */
    includeTimeZoneName?: boolean;
}

/**
 * Fields for {@link formatISODateTime}.
 */
export interface FormatISODateTimeParams extends FormatISODateTimeOptions {
    /**
     * The instant to format.
     */
    date: DateInput;
}
