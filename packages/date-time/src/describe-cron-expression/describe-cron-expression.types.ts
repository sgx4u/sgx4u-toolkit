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
