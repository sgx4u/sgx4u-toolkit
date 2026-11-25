import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { WeeklySchedule } from "../types/schedule.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { scheduleIsOpen } from "../utils/opening-hours.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Reports whether a weekly schedule is open at a date.
 *
 * A range whose end is not after its start continues past midnight. A
 * closure removes that calendar day and the overnight range that starts
 * on it.
 *
 * @param date - The instant to test.
 * @param schedule - Weekly hours and optional closures.
 * @param options - `timeZone` defaults to the system zone.
 * @returns `true` when the schedule is open.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * isOpenAt("2026-11-26T12:00:00Z", { hours: { 4: [{ start: "09:00", end: "17:00" }] } }, { timeZone: "UTC" }); // true
 */
export function isOpenAt(
    date: DateInput,
    schedule: WeeklySchedule,
    options?: TimeZoneOptions,
): boolean {
    const timeZone = resolveTimeZone(options?.timeZone);
    return scheduleIsOpen(
        resolveDateInput(date, "date", timeZone).getTime(),
        schedule,
        timeZone,
    );
}
