import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { upcomingCronRuns } from "../utils/cron.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetNextCronRunsParams } from "./get-next-cron-runs.types.js";

/**
 * Returns the next times a cron schedule fires.
 *
 * A wall time skipped by daylight saving does not run. A repeated wall
 * time runs once, at the earlier instant. The search stops at `endDate`
 * and after 366 days.
 *
 * @param params - `schedule` is required. `count` defaults to 1 and `now` to the current time.
 * @returns The runs, oldest first. An expression that does not parse returns `[]`. Returns `undefined` when `now` is not usable.
 * @throws {@link RangeError} When `count` is not an integer from 1 through 1000.
 * @example
 * getNextCronRuns({
 *   schedule: "0 9 * * *",
 *   now: "2026-11-26T08:00:00Z",
 *   timeZone: "UTC",
 * })[0]?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getNextCronRuns({
    schedule,
    count: requestedCount,
    now,
    endDate,
    timeZone,
}: GetNextCronRunsParams): Date[] | undefined {
    const parsed =
        typeof schedule === "string"
            ? parseCronExpression({ expression: schedule })
            : schedule;
    if (parsed === undefined) {
        return [];
    }
    const count = assertIntegerInRange(requestedCount ?? 1, "count", 1, 1_000);
    const zone = resolveTimeZone(timeZone);
    const start =
        now === undefined
            ? resolveNow(undefined, zone).getTime()
            : readDateInput(now, zone)?.getTime();
    if (start === undefined) {
        return undefined;
    }
    const end =
        endDate === undefined
            ? undefined
            : readDateInput(endDate, zone)?.getTime();
    return upcomingCronRuns(parsed, start, count, end, zone);
}
