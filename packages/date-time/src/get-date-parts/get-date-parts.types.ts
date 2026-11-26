import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link getDateParts}.
 */
export interface GetDatePartsParams extends TimeZoneOptions {
    /**
     * The instant to read.
     */
    date: DateInput;
}