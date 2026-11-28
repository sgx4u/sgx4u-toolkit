import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { startOfInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertBoundaryUnit } from "../utils/unit.utils.js";

/**
 * Fields for {@link startOfUnit}.
 */
export interface StartOfUnitParams extends TimeZoneOptions, WeekOptions {
    /**
     * The instant to align.
     */
    date: DateInput;
    /**
     * A time unit, or `"decade"`.
     */
    unit: TimeUnit | "decade";
}

/**
 * Returns the first millisecond of the unit that contains a date.
 *
 * A boundary that daylight saving skips, such as a missing midnight, moves
 * forward to the first instant that exists.
 *
 * @param params - `date` and `unit` are required. `timeZone` defaults to the system zone. `weekStartsOn` defaults to Monday.
 * @returns A new `Date`, or `undefined` when `date` is not a real date.
 * @throws {@link RangeError} When `unit`, `weekStartsOn`, or `timeZone` is invalid.
 * @example
 * startOfUnit({ date: "2026-11-26T15:45:00Z", unit: "day", timeZone: "UTC" })?.toISOString(); // "2026-11-26T00:00:00.000Z"
 */
export function startOfUnit({
    date,
    unit,
    timeZone,
    weekStartsOn,
}: StartOfUnitParams): Date | undefined {
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    return new Date(
        startOfInstant(
            resolved.getTime(),
            assertBoundaryUnit(unit),
            zone,
            resolveWeekStartsOn(weekStartsOn),
        ),
    );
}
