import type { DateInput } from "../types/date-input.types.js";
import type { AgeOptions } from "../get-age/get-age.types.js";

/**
 * Fields for {@link getNextAnniversary}.
 */
export interface GetNextAnniversaryParams extends AgeOptions {
    /**
     * The original date.
     */
    date: DateInput;
    /**
     * Whether today's anniversary counts as the next one.
     *
     * @defaultValue `true`
     */
    includeToday?: boolean;
}