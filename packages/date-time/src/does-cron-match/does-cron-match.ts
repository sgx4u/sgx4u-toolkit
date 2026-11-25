import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { CronSchedule } from "../types/cron.types.js";
import { parseCronExpression } from "../parse-cron-expression/parse-cron-expression.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { cronMatches } from "../utils/cron.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Reports whether a schedule fires at a date.
 *
 * When both the day of the month and the day of the week are restricted,
 * either field matching is enough.
 *
 * @param schedule - A cron expression or a parsed schedule.
 * @param date - The instant to test.
 * @param options - `timeZone` defaults to the system zone.
 * @returns `true` when the schedule fires at that minute or second.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * doesCronMatch("0 9 * * *", "2026-11-26T09:00:00Z", { timeZone: "UTC" }); // true
 */
export function doesCronMatch(
    schedule: string | CronSchedule,
    date: DateInput,
    options?: TimeZoneOptions,
): boolean {
    const parsed =
        typeof schedule === "string" ? parseCronExpression(schedule) : schedule;
    if (parsed === undefined) {
        return false;
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    return cronMatches(
        parsed,
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
}
