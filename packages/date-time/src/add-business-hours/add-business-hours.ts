import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    addBusinessMilliseconds,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import {
    assertDuration,
    clockMilliseconds,
    hasCalendarUnits,
} from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";

/**
 * Adds working time, skipping nights, weekends, and holidays.
 *
 * Only clock units are accepted. A start outside working hours begins at
 * the next opening when the duration is positive, or at the end of the
 * previous opening when it is negative.
 *
 * @param date - The start instant.
 * @param duration - Hours, minutes, seconds, or milliseconds.
 * @param calendar - Working hours, weekend days, holidays, and the zone.
 * @returns A new `Date`.
 * @throws {@link RangeError} When the duration contains a calendar unit, or 3660 consecutive days have no business day.
 * @example
 * addBusinessHours("2026-11-26T16:00:00Z", { hours: 2 }, { timeZone: "UTC" }).toISOString(); // "2026-11-27T10:00:00.000Z"
 */
export function addBusinessHours(
    date: DateInput,
    duration: Duration,
    calendar?: BusinessCalendar,
): Date {
    const checked = assertDuration(duration, "duration");
    if (hasCalendarUnits(checked)) {
        throw rangeError("duration", "clock units only", duration);
    }
    const resolved = resolveBusinessCalendar(calendar);
    return new Date(
        addBusinessMilliseconds(
            resolveDateInput(date, "date", resolved.timeZone).getTime(),
            clockMilliseconds(checked),
            resolved,
        ),
    );
}
