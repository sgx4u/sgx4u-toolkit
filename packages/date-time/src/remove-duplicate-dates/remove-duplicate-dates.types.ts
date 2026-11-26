import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Fields for {@link removeDuplicateDates}.
 */
export interface RemoveDuplicateDatesParams extends TimeZoneOptions {
    /**
     * The dates to filter.
     */
    dates: readonly DateInput[];
    /**
     * Dates that share this unit are duplicates. `"millisecond"` means the same instant.
     *
     * @defaultValue `"millisecond"`
     */
    unit?: TimeUnit;
}