import {
    addBusinessInstant,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import type { AddBusinessDaysParams } from "./add-business-days.types.js";

/**
 * Moves a date by a number of business days, keeping the time of day.
 *
 * Zero returns the same instant. A negative amount moves backward. A start
 * on a weekend or holiday does not count; the first step lands on the next
 * business day in that direction.
 *
 * @param params - `date`, `amount`, and optional business calendar fields.
 * @returns A new `Date`, or `undefined` when `date` or `amount` is not usable.
 * @throws {@link RangeError} When the calendar has no business day within the safety cap, or `workingDays`, `businessHours`, or `timeZone` is invalid.
 * @example
 * addBusinessDays({
 *   date: "2026-11-27T15:00:00Z",
 *   amount: 1,
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-30T15:00:00.000Z"
 */
export function addBusinessDays({
    date,
    amount,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: AddBusinessDaysParams): Date | undefined {
    if (typeof amount !== "number" || !Number.isInteger(amount)) {
        return undefined;
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
        addBusinessInstant(start.getTime(), amount, resolved),
    );
}