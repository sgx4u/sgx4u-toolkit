import type { DateInput } from "../types/date-input.types.js";
import { assertIntegerInRange } from "../utils/assert.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { IsWeekendOptions } from "./is-weekend.types.js";

/**
 * Reports whether a date falls on a weekend day.
 *
 * The default weekend is Saturday and Sunday. Pass `weekendDays` for a
 * different week, such as Friday and Saturday.
 *
 * @param date - The date to test.
 * @param options - `weekendDays` defaults to `[6, 7]`.
 * @returns `true` when the ISO weekday is in `weekendDays`.
 * @throws {@link TypeError} When `date` has the wrong type.
 * @throws {@link RangeError} When a weekday is outside 1 through 7.
 * @example
 * isWeekend("2026-11-28T00:00:00Z", { timeZone: "UTC" }); // true
 */
export function isWeekend(
    date: DateInput,
    options?: IsWeekendOptions,
): boolean {
    const timeZone = resolveTimeZone(options?.timeZone);
    const weekendDays = options?.weekendDays ?? [6, 7];
    if (!Array.isArray(weekendDays)) {
        throw typeError("weekendDays", "an array of weekdays", weekendDays);
    }
    const checked = weekendDays.map((weekday, index) =>
        assertIntegerInRange(weekday, `weekendDays[${String(index)}]`, 1, 7),
    );
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return checked.includes(parts.weekday);
}
