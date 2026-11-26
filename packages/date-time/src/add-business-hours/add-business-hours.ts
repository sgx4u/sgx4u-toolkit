import { readDateInput } from "../utils/date-input.utils.js";
import {
    addBusinessMilliseconds,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import {
    clockMilliseconds,
    hasCalendarUnits,
    readDuration,
} from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { AddBusinessHoursParams } from "./add-business-hours.types.js";

/**
 * Adds working time, skipping nights, weekends, and holidays.
 *
 * Only clock units are accepted. A start outside working hours begins at
 * the next opening when the duration is positive, or at the end of the
 * previous opening when it is negative.
 *
 * @param params - `date`, `duration`, and optional business calendar fields.
 * @returns A new `Date`, or `undefined` when `date` or `duration` is not usable.
 * @throws {@link RangeError} When the duration contains a calendar unit, the calendar has no business day within the safety cap, or `workingDays`, `businessHours`, or `timeZone` is invalid.
 * @example
 * addBusinessHours({
 *   date: "2026-11-26T16:00:00Z",
 *   duration: { hours: 2 },
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-27T10:00:00.000Z"
 */
export function addBusinessHours({
    date,
    duration,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: AddBusinessHoursParams): Date | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    if (hasCalendarUnits(checked)) {
        throw rangeError("duration", "clock units only", duration);
    }
    const resolved = resolveBusinessCalendar({
        workingDays,
        businessHours,
        holidays,
        timeZone,
    });
    const start = readDateInput(date, resolved.timeZone);
    if (start === undefined) {
        return undefined;
    }
    return new Date(
        addBusinessMilliseconds(
            start.getTime(),
            clockMilliseconds(checked),
            resolved,
        ),
    );
}
