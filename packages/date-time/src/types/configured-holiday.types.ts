import type { DateInput } from "./date-input.types.js";

/**
 * One holiday a calendar can close for.
 *
 * A date-only string is that calendar date in the time zone of the call
 * or of `createDateTime`. `name` is optional.
 */
export interface ConfiguredHoliday {
    /**
     * The holiday's instant or calendar date.
     */
    date: DateInput;
    /**
     * A label returned when a caller asks for the holiday's name.
     */
    name?: string;
}
