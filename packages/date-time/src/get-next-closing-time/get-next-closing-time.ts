import type { DateInput } from "../types/date-input.types.js";
import type { WeeklySchedule } from "../types/schedule.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { nextClosing } from "../utils/opening-hours.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link getNextClosingTime}.
 */
export interface GetNextClosingTimeParams {
    /**
     * The instant to search from.
     */
    date: DateInput;
    /**
     * Weekly hours and optional closures.
     */
    schedule: WeeklySchedule;
    /**
     * Zone used to read the schedule.
     */
    timeZone?: string;
}

/**
 * Returns the next time a weekly schedule closes.
 *
 * When the instant is open, the result is the end of the current open
 * interval. The search stops after 400 days.
 *
 * @param params - `date` and `schedule` are required.
 * @returns A new `Date`, or `undefined` when the schedule does not close.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getNextClosingTime({
 *   date: "2026-11-26T12:00:00Z",
 *   schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-26T17:00:00.000Z"
 */
export function getNextClosingTime({
    date,
    schedule,
    timeZone,
}: GetNextClosingTimeParams): Date | undefined {
    const zone = resolveTimeZone(timeZone);
    const closing = nextClosing(
        resolveDateInput(date, "date", zone).getTime(),
        schedule,
        zone,
    );
    return closing === undefined ? undefined : new Date(closing);
}
