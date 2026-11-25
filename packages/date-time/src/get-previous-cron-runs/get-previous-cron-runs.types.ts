import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * How earlier cron runs are chosen.
 */
export interface PreviousCronRunsOptions extends NowOptions, TimeZoneOptions {
    /**
     * How many runs to return.
     *
     * @defaultValue `1`
     */
    count?: number;
    /**
     * The search stops at this instant. A run at `startDate` is excluded.
     */
    startDate?: DateInput;
}
