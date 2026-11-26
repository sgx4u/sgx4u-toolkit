import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { earlierCronRuns } from "../utils/cron.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetPreviousCronRunsParams } from "./get-previous-cron-runs.types.js";

/**
 * Returns earlier times a cron schedule fired, newest first.
 *
 * @param params - `schedule` is required. `count` defaults to 1 and `now` to the current time.
 * @returns The runs. An expression that does not parse returns `[]`. Returns `undefined` when `now` is not usable.
 * @throws {@link RangeError} When `count` is not an integer from 1 through 1000.
 * @example
 * getPreviousCronRuns({
 *   schedule: "0 9 * * *",
 *   now: "2026-11-26T10:00:00Z",
 *   timeZone: "UTC",
 * })[0]?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getPreviousCronRuns({
    schedule,
    count: requestedCount,
    now,
    startDate,
    timeZone,
}: GetPreviousCronRunsParams): Date[] | undefined {
    const parsed =
        typeof schedule === "string" ? parseCronExpression(schedule) : schedule;
    if (parsed === undefined) {
        return [];
    }
    const count = assertIntegerInRange(
        requestedCount ?? 1,
        "count",
        1,
        1_000,
    );
    const zone = resolveTimeZone(timeZone);
    const before =
        now === undefined
            ? resolveNow(undefined, zone).getTime()
            : readDateInput(now, zone)?.getTime();
    if (before === undefined) {
        return undefined;
    }
    const earliest =
        startDate === undefined
            ? undefined
            : readDateInput(startDate, zone)?.getTime();
    return earlierCronRuns(parsed, before, count, zone).filter(
        (run) => earliest === undefined || run.getTime() > earliest,
    );
}