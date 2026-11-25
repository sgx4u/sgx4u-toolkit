import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * How upcoming cron runs are chosen.
 */
export interface NextCronRunsOptions extends NowOptions, TimeZoneOptions {
    /**
     * How many runs to return.
     *
     * @defaultValue `1`
     */
    count?: number;
    /**
     * The search stops at this instant. A run at `endDate` is excluded.
     */
    endDate?: DateInput;
}
