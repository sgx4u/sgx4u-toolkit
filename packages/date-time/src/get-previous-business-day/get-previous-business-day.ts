import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    adjacentBusinessDayStart,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Fields for {@link getPreviousBusinessDay}.
 */
export interface GetPreviousBusinessDayParams extends BusinessCalendar {
    /**
     * The date to move from.
     */
    date: DateInput;
}

/**
 * Returns the start of the previous business day.
 *
 * @param params - `date` is required. Calendar fields use business defaults.
 * @returns A new `Date` at the start of that day, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 * @example
 * getPreviousBusinessDay({ date: "2026-11-30T15:00:00Z", timeZone: "UTC" })?.toISOString(); // "2026-11-27T00:00:00.000Z"
 */
export function getPreviousBusinessDay({
    date,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: GetPreviousBusinessDayParams): Date | undefined {
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
    return new Date(adjacentBusinessDayStart(instant.getTime(), -1, resolved));
}
