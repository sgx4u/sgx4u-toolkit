import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { endOfInstant } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertBoundaryUnit } from "../utils/unit.utils.js";

/**
 * Returns the last millisecond of the unit that contains a date.
 *
 * The result is one millisecond before the next unit starts.
 *
 * @param date - The instant to align.
 * @param unit - A time unit, or `"decade"`.
 * @param options - `timeZone` defaults to the system zone. `weekStartsOn` defaults to Monday.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `date` or `unit` has the wrong type.
 * @throws {@link RangeError} When `date`, `unit`, or the zone is invalid.
 * @example
 * endOfUnit("2026-11-26T15:45:00Z", "day", { timeZone: "UTC" }).toISOString(); // "2026-11-26T23:59:59.999Z"
 */
export function endOfUnit(
    date: DateInput,
    unit: TimeUnit | "decade",
    options?: TimeZoneOptions & WeekOptions,
): Date {
    const timeZone = resolveTimeZone(options?.timeZone);
    return new Date(
        endOfInstant(
            resolveDateInput(date, "date", timeZone).getTime(),
            assertBoundaryUnit(unit),
            timeZone,
            resolveWeekStartsOn(options?.weekStartsOn),
        ),
    );
}
