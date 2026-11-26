import type { NowOptions, TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { endOfInstant } from "../utils/arithmetic.utils.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";

/**
 * Fields for {@link getMillisecondsUntilNextUnit}.
 */
export interface GetMillisecondsUntilNextUnitParams
    extends NowOptions,
        TimeZoneOptions,
        WeekOptions {
    /**
     * The boundary to wait for.
     */
    unit: TimeUnit;
}

/**
 * Returns the delay until the next unit boundary.
 *
 * The result is in `(0, unit length]`. At an exact boundary it is the
 * full length of the following unit, never zero, so a timer can schedule
 * the next aligned wake-up.
 *
 * @param params - `unit` is required. `now`, `timeZone`, and `weekStartsOn` use their defaults.
 * @returns Milliseconds until that boundary, or `undefined` when `now` is not usable.
 * @throws {@link RangeError} When `unit` is not a time unit or `timeZone` is not usable.
 * @example
 * getMillisecondsUntilNextUnit({
 *   unit: "hour",
 *   now: "2026-01-01T00:00:00Z",
 *   timeZone: "UTC",
 * }); // 3600000
 */
export function getMillisecondsUntilNextUnit({
    unit,
    now,
    timeZone,
    weekStartsOn,
}: GetMillisecondsUntilNextUnitParams): number | undefined {
    const zone = resolveTimeZone(timeZone);
    const reference =
        now === undefined ? resolveNow(undefined, zone) : readDateInput(now, zone);
    if (reference === undefined) {
        return undefined;
    }
    const current = reference.getTime();
    const nextBoundary =
        endOfInstant(
            current,
            assertTimeUnit(unit),
            zone,
            resolveWeekStartsOn(weekStartsOn),
        ) + 1;
    return nextBoundary - current;
}