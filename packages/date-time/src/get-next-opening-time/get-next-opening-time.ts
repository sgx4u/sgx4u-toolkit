import type { DateInput } from "../types/date-input.types.js";
import type { WeeklySchedule } from "../types/schedule.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { nextOpening } from "../utils/opening-hours.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link getNextOpeningTime}.
 */
export interface GetNextOpeningTimeParams {
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
 * Returns the next time a weekly schedule opens.
 *
 * An instant that is already inside open hours is not returned. The search
 * stops after 400 days.
 *
 * @param params - `date` and `schedule` are required.
 * @returns A new `Date`, or `undefined` when the schedule does not open.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getNextOpeningTime({
 *   date: "2026-11-26T08:00:00Z",
 *   schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getNextOpeningTime({
    date,
    schedule,
    timeZone,
}: GetNextOpeningTimeParams): Date | undefined {
    const zone = resolveTimeZone(timeZone);
    const opening = nextOpening(
        resolveDateInput(date, "date", zone).getTime(),
        schedule,
        zone,
    );
    return opening === undefined ? undefined : new Date(opening);
}
