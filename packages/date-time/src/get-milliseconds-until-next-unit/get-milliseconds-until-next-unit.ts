import type {
    NowOptions,
    TimeZoneOptions,
    WeekOptions,
} from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { endOfInstant } from "../utils/arithmetic.utils.js";
import { resolveNow } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";

/**
 * Returns the delay until the next unit boundary.
 *
 * The result is in `(0, unit length]`. At an exact boundary it is the
 * full length of the following unit, never zero, so a timer can schedule
 * the next aligned wake-up.
 *
 * @param unit - The boundary to wait for.
 * @param options - `now` defaults to the current time. `weekStartsOn` defaults to Monday.
 * @returns Milliseconds until that boundary.
 * @throws {@link TypeError} When `unit` has the wrong type.
 * @throws {@link RangeError} When `unit` is not a time unit.
 * @example
 * getMillisecondsUntilNextUnit("hour", { now: "2026-01-01T00:00:00Z", timeZone: "UTC" }); // 3600000
 */
export function getMillisecondsUntilNextUnit(
    unit: TimeUnit,
    options?: NowOptions & TimeZoneOptions & WeekOptions,
): number {
    const timeZone = resolveTimeZone(options?.timeZone);
    const now = resolveNow(options?.now, timeZone).getTime();
    const nextBoundary =
        endOfInstant(
            now,
            assertTimeUnit(unit),
            timeZone,
            resolveWeekStartsOn(options?.weekStartsOn),
        ) + 1;
    return nextBoundary - now;
}
