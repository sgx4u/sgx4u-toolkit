import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    nextBusinessOpening,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Fields for {@link getNextBusinessHoursStart}.
 */
export interface GetNextBusinessHoursStartParams extends BusinessCalendar {
    /**
     * The date to measure from.
     */
    date: DateInput;
}

/**
 * Returns the date itself when it is inside working hours, otherwise the next opening.
 *
 * @param params - `date` is required. Calendar fields use business defaults.
 * @returns A new `Date`, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 * @example
 * getNextBusinessHoursStart({ date: "2026-11-26T08:00:00Z", timeZone: "UTC" })?.toISOString(); // "2026-11-26T09:00:00.000Z"
 */
export function getNextBusinessHoursStart({
    date,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: GetNextBusinessHoursStartParams): Date | undefined {
    const resolved = resolveBusinessCalendar({
        workingDays,
        businessHours,
        holidays,
        timeZone,
    });
    const instant = readDateInput(date, resolved.timeZone);
    if (instant === undefined) {
        return undefined;
    }
    return new Date(nextBusinessOpening(instant.getTime(), resolved));
}
