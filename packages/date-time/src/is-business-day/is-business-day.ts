import type { DateInput } from "../types/date-input.types.js";
import type { BusinessCalendar } from "../types/business.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    isBusinessInstant,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Reports whether a date falls on a business day.
 *
 * A business day is a day whose ISO weekday is not in `weekendDays` and
 * that `holidays` does not match. The default weekend is Saturday and Sunday.
 *
 * @param date - The date to test.
 * @param calendar - Weekend days, holidays, and the zone. All are optional.
 * @returns `true` when the calendar day is a business day.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * isBusinessDay("2026-11-28T00:00:00Z", { timeZone: "UTC" }); // false
 */
export function isBusinessDay(
    date: DateInput,
    calendar?: BusinessCalendar,
): boolean {
    const resolved = resolveBusinessCalendar(calendar);
    return isBusinessInstant(
        resolveDateInput(date, "date", resolved.timeZone).getTime(),
        resolved,
    );
}
