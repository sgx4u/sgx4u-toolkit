import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { CronSchedule } from "../types/cron.types.js";

/**
 * Fields for {@link doesCronMatch}.
 */
export interface DoesCronMatchParams extends TimeZoneOptions {
    /**
     * A cron expression or a parsed schedule.
     */
    schedule: string | CronSchedule;
    /**
     * The instant to test.
     */
    date: DateInput;
}
