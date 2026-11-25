import type { CronSchedule } from "../types/cron.types.js";
import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { upcomingCronRuns } from "../utils/cron.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { NextCronRunsOptions } from "./get-next-cron-runs.types.js";

/**
 * Returns the next times a cron schedule fires.
 *
 * A wall time skipped by daylight saving does not run. A repeated wall
 * time runs once, at the earlier instant. The search stops at `endDate`
 * and after 366 days.
 *
 * @param schedule - A cron expression or a parsed schedule.
 * @param options - `count` defaults to 1 and `now` to the current time.
 * @returns The runs, oldest first. An expression that does not parse returns `[]`.
 * @throws {@link RangeError} When `count` is not an integer from 1 through 1000.
 * @example
 * getNextCronRuns("0 9 * * *", { now: "2026-11-26T08:00:00Z", timeZone: "UTC" })[0]?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getNextCronRuns(
    schedule: string | CronSchedule,
    options?: NextCronRunsOptions,
): Date[] {
    const parsed =
        typeof schedule === "string" ? parseCronExpression(schedule) : schedule;
    if (parsed === undefined) {
        return [];
    }
    const count = assertIntegerInRange(options?.count ?? 1, "count", 1, 1_000);
    const timeZone = resolveTimeZone(options?.timeZone);
    const start =
        options?.now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(options.now, "now", timeZone).getTime();
    const end =
        options?.endDate === undefined
            ? undefined
            : resolveDateInput(options.endDate, "endDate", timeZone).getTime();
    return upcomingCronRuns(parsed, start, count, end, timeZone);
}
