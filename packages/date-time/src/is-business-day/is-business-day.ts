import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    isBusinessInstant,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Fields for {@link isBusinessDay}.
 */
export interface IsBusinessDayParams extends BusinessCalendar {
    /**
     * The date to test.
     */
    date: DateInput;
}

/**
 * Reports whether a date falls on a business day.
 *
 * A business day is a day whose ISO weekday is in `workingDays` and that
 * `holidays` does not match. The default working week is Monday through Friday.
 *
 * @param params - `date` is required. `workingDays`, `businessHours`, `holidays`, and `timeZone` use business defaults.
 * @returns `true` when the calendar day is a business day.
 * @throws {@link TypeError} When `workingDays` or `businessHours` has the wrong type.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * isBusinessDay({ date: "2026-11-28T00:00:00Z", timeZone: "UTC" }); // false
 */
export function isBusinessDay({
    date,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: IsBusinessDayParams): boolean {
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
    return isBusinessInstant(instant.getTime(), resolved);
}
