import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the calendar quarter, from 1 through 4.
 *
 * January through March are quarter 1.
 *
 * @param date - The date to read.
 * @param options - `timeZone` defaults to the system zone.
 * @returns `1`, `2`, `3`, or `4`.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * getQuarter("2026-11-26T00:00:00Z", { timeZone: "UTC" }); // 4
 */
export function getQuarter(
    date: DateInput,
    options?: TimeZoneOptions,
): 1 | 2 | 3 | 4 {
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return (Math.floor((parts.month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}
