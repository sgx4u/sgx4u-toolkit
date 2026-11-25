import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { WeeklySchedule } from "../types/schedule.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { nextClosing } from "../utils/opening-hours.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the next time a weekly schedule closes.
 *
 * When the instant is open, the result is the end of the current open
 * interval. The search stops after 400 days.
 *
 * @param date - The instant to search from.
 * @param schedule - Weekly hours and optional closures.
 * @param options - `timeZone` defaults to the system zone.
 * @returns A new `Date`, or `undefined` when the schedule does not close.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getNextClosingTime("2026-11-26T12:00:00Z", { hours: { 4: [{ start: "09:00", end: "17:00" }] } }, { timeZone: "UTC" })?.toISOString(); // "2026-11-26T17:00:00.000Z"
 */
export function getNextClosingTime(
    date: DateInput,
    schedule: WeeklySchedule,
    options?: TimeZoneOptions,
): Date | undefined {
    const timeZone = resolveTimeZone(options?.timeZone);
    const closing = nextClosing(
        resolveDateInput(date, "date", timeZone).getTime(),
        schedule,
        timeZone,
    );
    return closing === undefined ? undefined : new Date(closing);
}
