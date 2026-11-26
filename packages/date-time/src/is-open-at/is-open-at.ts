import type { DateInput } from "../types/date-input.types.js";
import type { WeeklySchedule } from "../types/schedule.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { scheduleIsOpen } from "../utils/opening-hours.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link isOpenAt}.
 */
export interface IsOpenAtParams {
    /**
     * The instant to test.
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
 * Reports whether a weekly schedule is open at a date.
 *
 * A range whose end is not after its start continues past midnight. A
 * closure removes that calendar day and the overnight range that starts
 * on it.
 *
 * @param params - `date` and `schedule` are required.
 * @returns `true` when the schedule is open.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * isOpenAt({
 *   date: "2026-11-26T12:00:00Z",
 *   schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
 *   timeZone: "UTC",
 * }); // true
 */
export function isOpenAt({
    date,
    schedule,
    timeZone,
}: IsOpenAtParams): boolean {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return false;
    }
    return scheduleIsOpen(instant.getTime(), schedule, zone);
}