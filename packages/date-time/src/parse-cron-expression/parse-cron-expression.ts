import type { CronSchedule } from "../types/cron.types.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import { parseCronText } from "../utils/cron.utils.js";
import type { ParseCronExpressionParams } from "./parse-cron-expression.types.js";

/**
 * Parses a cron expression.
 *
 * Five fields are minute, hour, day of month, month, and day of week.
 * A sixth leading field is seconds. `?`, lists, ranges, steps, month and
 * weekday names, `L`, `L-n`, `W`, `LW`, `#`, and `nL` are accepted.
 * `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight`,
 * and `@hourly` are nicknames. `@reboot` does not parse.
 *
 * @param params - `expression` is required. `seconds` defaults to `"optional"`.
 * @returns The schedule, or `undefined` when the text is not a cron expression.
 * @throws {@link TypeError} When `expression` is not a string.
 * @throws {@link RangeError} When `seconds` is not a known mode.
 * @example
 * parseCronExpression({ expression: "0 9 * * 1-5" })?.hours; // [9]
 */
export function parseCronExpression({
    expression,
    seconds = "optional",
}: ParseCronExpressionParams): CronSchedule | undefined {
    if (typeof expression !== "string") {
        throw typeError("expression", "a string", expression);
    }
    if (seconds !== "optional" && seconds !== "required" && seconds !== "none") {
        throw rangeError(
            "seconds",
            `"optional", "required", or "none"`,
            seconds,
        );
    }
    return parseCronText(expression, seconds);
}