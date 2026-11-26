import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { describeCronSchedule } from "../utils/cron.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { DescribeCronExpressionParams } from "./describe-cron-expression.types.js";

/**
 * Describes a cron expression in English.
 *
 * @param params - `schedule` is the cron text or a parsed schedule. `hourCycle` defaults to `"h12"`.
 * @returns Text such as `At 09:00 AM, Monday through Friday`. An expression that does not parse returns an empty string.
 * @throws {@link RangeError} When `hourCycle` is unknown.
 * @example
 * describeCronExpression({ schedule: "0 9 * * 1-5" }); // "At 09:00 AM, Monday through Friday"
 */
export function describeCronExpression({
    schedule,
    hourCycle = "h12",
}: DescribeCronExpressionParams): string {
    if (hourCycle !== "h12" && hourCycle !== "h23") {
        throw rangeError("hourCycle", `"h12" or "h23"`, hourCycle);
    }
    const parsed =
        typeof schedule === "string"
            ? parseCronExpression({ expression: schedule })
            : schedule;
    if (parsed === undefined) {
        return "";
    }
    return describeCronSchedule(parsed, hourCycle);
}
