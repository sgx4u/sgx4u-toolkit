import type { DateInput } from "../types/date-input.types.js";
import type { BusinessCalendar } from "../types/business.types.js";
import { assertInteger } from "../utils/assert.utils.js";
import {
    addBusinessInstant,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";

/**
 * Moves a date by a number of business days, keeping the time of day.
 *
 * Zero returns the same instant. A negative amount moves backward. A start
 * on a weekend or holiday does not count; the first step lands on the next
 * business day in that direction.
 *
 * @param date - The starting instant.
 * @param amount - Business days to add.
 * @param calendar - Weekend days, holidays, and the zone.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `amount` is not a number.
 * @throws {@link RangeError} When `amount` is not an integer, or the calendar has no business day.
 * @example
 * addBusinessDays("2026-11-27T15:00:00Z", 1, { timeZone: "UTC" }).toISOString(); // "2026-11-30T15:00:00.000Z"
 */
export function addBusinessDays(
    date: DateInput,
    amount: number,
    calendar?: BusinessCalendar,
): Date {
    const days = assertInteger(amount, "amount");
    const resolved = resolveBusinessCalendar(calendar);
    return new Date(
        addBusinessInstant(
            resolveDateInput(date, "date", resolved.timeZone).getTime(),
            days,
            resolved,
        ),
    );
}
