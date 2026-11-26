import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    isInsideWorkingHours,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Fields for {@link isWithinBusinessHours}.
 */
export interface IsWithinBusinessHoursParams extends BusinessCalendar {
    /**
     * The date to test.
     */
    date: DateInput;
}

/**
 * Reports whether a date is inside working hours on a business day.
 *
 * The default window is 09:00–17:00. The end is excluded.
 *
 * @param params - `date` is required. `workingDays`, `businessHours`, `holidays`, and `timeZone` use business defaults.
 * @returns `true` when the instant is open.
 * @throws {@link TypeError} When `workingDays` or `businessHours` has the wrong type.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * isWithinBusinessHours({ date: "2026-11-26T12:00:00Z", timeZone: "UTC" }); // true
 */
export function isWithinBusinessHours({
    date,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: IsWithinBusinessHoursParams): boolean {
    const resolved = resolveBusinessCalendar({
        workingDays,
        businessHours,
        holidays,
        timeZone,
    });
    const instant = readDateInput(date, resolved.timeZone);
    if (instant === undefined) {
        return false;
    }
    return isInsideWorkingHours(instant.getTime(), resolved);
}