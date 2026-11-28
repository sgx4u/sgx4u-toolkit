import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link formatRFC2822Date}.
 */
export interface FormatRFC2822DateParams extends TimeZoneOptions {
    /**
     * The instant to format.
     */
    date: DateInput;
}
