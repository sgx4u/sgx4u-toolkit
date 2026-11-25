import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    isInsideWorkingHours,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Reports whether a date is inside working hours on a business day.
 *
 * The default window is 09:00–17:00. The end is excluded.
 *
 * @param date - The date to test.
 * @param calendar - Working hours, weekend days, holidays, and the zone.
 * @returns `true` when the instant is open.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * isWithinBusinessHours("2026-11-26T12:00:00Z", { timeZone: "UTC" }); // true
 */
export function isWithinBusinessHours(
    date: DateInput,
    calendar?: BusinessCalendar,
): boolean {
    const resolved = resolveBusinessCalendar(calendar);
    return isInsideWorkingHours(
        resolveDateInput(date, "date", resolved.timeZone).getTime(),
        resolved,
    );
}
