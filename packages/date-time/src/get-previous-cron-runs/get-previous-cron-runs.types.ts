import type { CronSchedule } from "../types/cron.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link getPreviousCronRuns}.
 */
export interface GetPreviousCronRunsParams extends NowOptions, TimeZoneOptions {
    /**
     * A cron expression or a parsed schedule.
     */
    schedule: string | CronSchedule;
    /**
     * How many runs to return.
     *
     * @defaultValue `1`
     */
    count?: number;
    /**
     * Runs at or before this instant are excluded.
     */
    startDate?: DateInput;
}