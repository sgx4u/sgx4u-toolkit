import type { CronSchedule } from "../types/cron.types.js";
import { parseCronText } from "../utils/cron.utils.js";
import type { ParseCronExpressionOptions } from "./parse-cron-expression.types.js";

/**
 * Parses a cron expression.
 *
 * Five fields are minute, hour, day of month, month, and day of week.
 * A sixth leading field is seconds. `?`, lists, ranges, steps, month and
 * weekday names, `L`, `L-n`, `W`, `LW`, `#`, and `nL` are accepted.
 * `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight`,
 * and `@hourly` are nicknames. `@reboot` does not parse.
 *
 * @param expression - The cron text.
 * @param options - `seconds` defaults to `"optional"`.
 * @returns The schedule, or `undefined` when the text is not a cron expression.
 * @throws {@link TypeError} When `expression` is not a string.
 * @throws {@link RangeError} When `seconds` is not a known mode.
 * @example
 * parseCronExpression("0 9 * * 1-5")?.hours; // [9]
 */
export function parseCronExpression(
    expression: string,
    options?: ParseCronExpressionOptions,
): CronSchedule | undefined {
    return parseCronText(expression, options?.seconds ?? "optional");
}
