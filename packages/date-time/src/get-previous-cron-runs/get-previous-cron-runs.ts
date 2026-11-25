import type { CronSchedule } from "../types/cron.types.js";
import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { earlierCronRuns } from "../utils/cron.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { PreviousCronRunsOptions } from "./get-previous-cron-runs.types.js";

/**
 * Returns earlier times a cron schedule fired, newest first.
 *
 * @param schedule - A cron expression or a parsed schedule.
 * @param options - `count` defaults to 1 and `now` to the current time.
 * @returns The runs. An expression that does not parse returns `[]`.
 * @throws {@link RangeError} When `count` is not an integer from 1 through 1000.
 * @example
 * getPreviousCronRuns("0 9 * * *", { now: "2026-11-26T10:00:00Z", timeZone: "UTC" })[0]?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getPreviousCronRuns(
    schedule: string | CronSchedule,
    options?: PreviousCronRunsOptions,
): Date[] {
    const parsed =
        typeof schedule === "string" ? parseCronExpression(schedule) : schedule;
    if (parsed === undefined) {
        return [];
    }
    const count = assertIntegerInRange(options?.count ?? 1, "count", 1, 1_000);
    const timeZone = resolveTimeZone(options?.timeZone);
    const before =
        options?.now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(options.now, "now", timeZone).getTime();
    const earliest =
        options?.startDate === undefined
            ? undefined
            : resolveDateInput(
                  options.startDate,
                  "startDate",
                  timeZone,
              ).getTime();
    return earlierCronRuns(parsed, before, count, timeZone).filter(
        (run) => earliest === undefined || run.getTime() > earliest,
    );
}
