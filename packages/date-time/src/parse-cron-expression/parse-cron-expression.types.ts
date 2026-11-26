/**
 * Fields for {@link parseCronExpression}.
 */
export interface ParseCronExpressionParams {
    /**
     * The cron text.
     */
    expression: string;
    /**
     * `"optional"` accepts five or six fields. `"required"` accepts six.
     * `"none"` accepts five.
     *
     * @defaultValue `"optional"`
     */
    seconds?: "optional" | "required" | "none";
}