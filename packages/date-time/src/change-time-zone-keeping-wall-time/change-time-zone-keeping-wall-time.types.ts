import type { DateInput } from "../types/date-input.types.js";
import type { DisambiguationOptions } from "../types/options.types.js";

/**
 * Fields for {@link changeTimeZoneKeepingWallTime}.
 */
export interface ChangeTimeZoneKeepingWallTimeParams
    extends DisambiguationOptions {
    /**
     * The original instant.
     */
    date: DateInput;
    /**
     * The zone the clock reading is taken from.
     */
    fromTimeZone: string;
    /**
     * The zone that should show the same clock reading.
     */
    toTimeZone: string;
}