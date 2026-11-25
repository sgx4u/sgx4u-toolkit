import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { startOfInstant } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertBoundaryUnit } from "../utils/unit.utils.js";

/**
 * Returns the first millisecond of the unit that contains a date.
 *
 * A boundary that daylight saving skips, such as a missing midnight, moves
 * forward to the first instant that exists.
 *
 * @param date - The instant to align.
 * @param unit - A time unit, or `"decade"`.
 * @param options - `timeZone` defaults to the system zone. `weekStartsOn` defaults to Monday.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `date` or `unit` has the wrong type.
 * @throws {@link RangeError} When `date`, `unit`, or the zone is invalid.
 * @example
 * startOfUnit("2026-11-26T15:45:00Z", "day", { timeZone: "UTC" }).toISOString(); // "2026-11-26T00:00:00.000Z"
 */
export function startOfUnit(
    date: DateInput,
    unit: TimeUnit | "decade",
    options?: TimeZoneOptions & WeekOptions,
): Date {
    const timeZone = resolveTimeZone(options?.timeZone);
    return new Date(
        startOfInstant(
            resolveDateInput(date, "date", timeZone).getTime(),
            assertBoundaryUnit(unit),
            timeZone,
            resolveWeekStartsOn(options?.weekStartsOn),
        ),
    );
}
