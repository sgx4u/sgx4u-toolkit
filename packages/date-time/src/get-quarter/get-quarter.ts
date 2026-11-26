import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link getQuarter}.
 */
export interface GetQuarterParams {
    /**
     * The date to read.
     */
    date: DateInput;
    /**
     * Zone used to read the calendar month.
     */
    timeZone?: string;
}

/**
 * Returns the calendar quarter, from 1 through 4.
 *
 * January through March are quarter 1.
 *
 * @param params - `date` is required. `timeZone` defaults to the system zone.
 * @returns `1`, `2`, `3`, or `4`, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getQuarter({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" }); // 4
 */
export function getQuarter({
    date,
    timeZone,
}: GetQuarterParams): 1 | 2 | 3 | 4 | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return (Math.floor((parts.month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}
