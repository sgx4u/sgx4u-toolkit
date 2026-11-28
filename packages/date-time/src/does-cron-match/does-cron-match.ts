import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { cronMatches } from "../utils/cron.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { DoesCronMatchParams } from "./does-cron-match.types.js";

/**
 * Reports whether a schedule fires at a date.
 *
 * When both the day of the month and the day of the week are restricted,
 * either field matching is enough.
 *
 * @param params - `schedule` and `date` are required. `timeZone` defaults to the system zone.
 * @returns `true` when the schedule fires at that minute or second.
 * @throws {@link RangeError} When `timeZone` is not a usable zone.
 * @example
 * doesCronMatch({
 *   schedule: "0 9 * * *",
 *   date: "2026-11-26T09:00:00Z",
 *   timeZone: "UTC",
 * }); // true
 */
export function doesCronMatch({
    schedule,
    date,
    timeZone,
}: DoesCronMatchParams): boolean {
    const parsed =
        typeof schedule === "string"
            ? parseCronExpression({ expression: schedule })
            : schedule;
    if (parsed === undefined) {
        return false;
    }
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return false;
    }
    return cronMatches(parsed, instant.getTime(), zone);
}
