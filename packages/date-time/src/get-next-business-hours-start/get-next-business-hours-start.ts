import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    nextBusinessOpening,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Returns the date itself when it is inside working hours, otherwise the next opening.
 *
 * @param date - The date to measure from.
 * @param calendar - Working hours, weekend days, holidays, and the zone.
 * @returns A new `Date`.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 * @example
 * getNextBusinessHoursStart("2026-11-26T08:00:00Z", { timeZone: "UTC" }).toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getNextBusinessHoursStart(
    date: DateInput,
    calendar?: BusinessCalendar,
): Date {
    const resolved = resolveBusinessCalendar(calendar);
    return new Date(
        nextBusinessOpening(
            resolveDateInput(date, "date", resolved.timeZone).getTime(),
            resolved,
        ),
    );
}
