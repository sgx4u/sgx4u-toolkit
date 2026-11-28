import type { CronSchedule } from "../types/cron.types.js";

/**
 * How a cron description writes hours.
 */
export interface DescribeCronExpressionOptions {
    /**
     * `"h12"` writes AM and PM. `"h23"` writes hours from 00 through 23.
     *
     * @defaultValue `"h12"`
     */
    hourCycle?: "h12" | "h23";
}

/**
 * Fields for {@link describeCronExpression}.
 */
export interface DescribeCronExpressionParams extends DescribeCronExpressionOptions {
    /**
     * A cron expression or a parsed schedule.
     */
    schedule: string | CronSchedule;
}
