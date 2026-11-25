import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeOfDay } from "../types/time.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the wall-clock time of a date in a zone.
 *
 * @param date - The instant to read.
 * @param options - `timeZone` defaults to the system zone.
 * @returns Hour, minute, second, and millisecond.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getTimeOfDay("2026-11-25T22:00:00.000Z", { timeZone: "Asia/Kolkata" }); // { hour: 3, minute: 30, second: 0, millisecond: 0 }
 */
export function getTimeOfDay(
    date: DateInput,
    options?: TimeZoneOptions,
): TimeOfDay {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return {
        hour: parts.hour,
        minute: parts.minute,
        second: parts.second,
        millisecond: parts.millisecond,
    };
}
