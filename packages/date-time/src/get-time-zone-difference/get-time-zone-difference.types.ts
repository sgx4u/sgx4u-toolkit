import type { DateInput } from "../types/date-input.types.js";

/**
 * When two time zones are compared.
 */
export interface TimeZoneDifferenceOptions {
    /**
     * The instant at which the offsets are read.
     *
     * @defaultValue The current time.
     */
    at?: DateInput;
}
