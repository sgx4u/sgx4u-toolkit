import type { CronSchedule } from "../types/cron.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link getNextCronRuns}.
 */
export interface GetNextCronRunsParams extends NowOptions, TimeZoneOptions {
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
     * The search stops at this instant. A run at `endDate` is excluded.
     */
    endDate?: DateInput;
}
