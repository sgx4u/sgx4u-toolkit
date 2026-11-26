import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link getTimeZoneDifference}.
 */
export interface GetTimeZoneDifferenceParams {
    /**
     * The zone being compared.
     */
    firstTimeZone: string;
    /**
     * The zone it is compared with.
     */
    secondTimeZone: string;
    /**
     * The instant at which the offsets are read.
     *
     * @defaultValue The current time.
     */
    at?: DateInput;
}