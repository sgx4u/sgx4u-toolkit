import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import type { ParseCronExpressionOptions } from "../parse-cron-expression/parse-cron-expression.types.js";

/**
 * Reports whether text is a cron expression.
 *
 * @param expression - The cron text.
 * @param options - `seconds` defaults to `"optional"`.
 * @returns `true` when `parseCronExpression` returns a schedule.
 * @throws {@link TypeError} When `expression` is not a string.
 * @throws {@link RangeError} When `seconds` is not a known mode.
 * @example
 * isValidCronExpression("@daily"); // true
 */
export function isValidCronExpression(
    expression: string,
    options?: ParseCronExpressionOptions,
): boolean {
    return parseCronExpression(expression, options) !== undefined;
}
