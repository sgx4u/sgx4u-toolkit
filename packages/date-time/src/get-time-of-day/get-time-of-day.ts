import type { DateInput } from "../types/date-input.types.js";
import type { TimeOfDay } from "../types/time.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link getTimeOfDay}.
 */
export interface GetTimeOfDayParams {
    /**
     * The instant to read.
     */
    date: DateInput;
    /**
     * Zone used to read wall-clock fields.
     */
    timeZone?: string;
}

/**
 * Returns the wall-clock time of a date in a zone.
 *
 * @param params - `date` is required. `timeZone` defaults to the system zone.
 * @returns Hour, minute, second, and millisecond, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getTimeOfDay({
 *   date: "2026-11-25T22:00:00.000Z",
 *   timeZone: "Asia/Kolkata",
 * }); // { hour: 3, minute: 30, second: 0, millisecond: 0 }
 */
export function getTimeOfDay({
    date,
    timeZone,
}: GetTimeOfDayParams): TimeOfDay | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), zone);
    return {
        hour: parts.hour,
        minute: parts.minute,
        second: parts.second,
        millisecond: parts.millisecond,
    };
}
