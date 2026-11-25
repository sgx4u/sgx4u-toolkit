import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    adjacentBusinessDayStart,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Returns the start of the next business day.
 *
 * The current day is never returned, even when it is a business day.
 *
 * @param date - The date to move from.
 * @param calendar - Weekend days, holidays, and the zone.
 * @returns A new `Date` at the start of that day.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 * @example
 * getNextBusinessDay("2026-11-27T15:00:00Z", { timeZone: "UTC" }).toISOString(); // "2026-11-30T00:00:00.000Z"
 */
export function getNextBusinessDay(
    date: DateInput,
    calendar?: BusinessCalendar,
): Date {
    const resolved = resolveBusinessCalendar(calendar);
    return new Date(
        adjacentBusinessDayStart(
            resolveDateInput(date, "date", resolved.timeZone).getTime(),
            1,
            resolved,
        ),
    );
}
