import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * How duplicate dates are recognized.
 */
export interface RemoveDuplicateDatesOptions extends TimeZoneOptions {
    /**
     * Dates that share this unit are duplicates. `"millisecond"` means the same instant.
     *
     * @defaultValue `"millisecond"`
     */
    unit?: TimeUnit;
}
