import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { WeeklySchedule } from "../types/schedule.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { nextOpening } from "../utils/opening-hours.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the next time a weekly schedule opens.
 *
 * An instant that is already inside open hours is not returned. The search
 * stops after 400 days.
 *
 * @param date - The instant to search from.
 * @param schedule - Weekly hours and optional closures.
 * @param options - `timeZone` defaults to the system zone.
 * @returns A new `Date`, or `undefined` when the schedule does not open.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getNextOpeningTime("2026-11-26T08:00:00Z", { hours: { 4: [{ start: "09:00", end: "17:00" }] } }, { timeZone: "UTC" })?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getNextOpeningTime(
    date: DateInput,
    schedule: WeeklySchedule,
    options?: TimeZoneOptions,
): Date | undefined {
    const timeZone = resolveTimeZone(options?.timeZone);
    const opening = nextOpening(
        resolveDateInput(date, "date", timeZone).getTime(),
        schedule,
        timeZone,
    );
    return opening === undefined ? undefined : new Date(opening);
}
