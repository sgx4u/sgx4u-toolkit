import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import type { ParseCronExpressionParams } from "../parse-cron-expression/parse-cron-expression.types.js";
import { typeError } from "../utils/error.utils.js";

/**
 * Fields for {@link isValidCronExpression}.
 */
export interface IsValidCronExpressionParams extends Omit<
    ParseCronExpressionParams,
    "expression"
> {
    /**
     * The cron text.
     */
    expression: string;
}

/**
 * Reports whether text is a cron expression.
 *
 * @param params - `expression` is required. `seconds` defaults to `"optional"`.
 * @returns `true` when `parseCronExpression` returns a schedule.
 * @throws {@link TypeError} When `expression` is not a string.
 * @throws {@link RangeError} When `seconds` is not a known mode.
 * @example
 * isValidCronExpression({ expression: "@daily" }); // true
 */
export function isValidCronExpression({
    expression,
    seconds,
}: IsValidCronExpressionParams): boolean {
    if (typeof expression !== "string") {
        throw typeError("expression", "a string", expression);
    }
    return (
        parseCronExpression({
            expression,
            ...(seconds !== undefined ? { seconds } : {}),
        }) !== undefined
    );
}
