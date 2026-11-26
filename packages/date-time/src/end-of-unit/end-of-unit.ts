import { endOfInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertBoundaryUnit } from "../utils/unit.utils.js";
import type { EndOfUnitParams } from "./end-of-unit.types.js";

/**
 * Returns the last millisecond of the unit that contains a date.
 *
 * The result is one millisecond before the next unit starts.
 *
 * @param params - `date` and `unit` are required. `timeZone` defaults to the system zone and `weekStartsOn` to Monday.
 * @returns A new `Date`, or `undefined` when `date` is not usable.
 * @throws {@link TypeError} When `unit` is not a string.
 * @throws {@link RangeError} When `unit`, `weekStartsOn`, or `timeZone` is invalid.
 * @example
 * endOfUnit({
 *   date: "2026-11-26T15:45:00Z",
 *   unit: "day",
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-26T23:59:59.999Z"
 */
export function endOfUnit({
    date,
    unit,
    timeZone,
    weekStartsOn,
}: EndOfUnitParams): Date | undefined {
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    return new Date(
        endOfInstant(
            resolved.getTime(),
            assertBoundaryUnit(unit),
            zone,
            resolveWeekStartsOn(weekStartsOn),
        ),
    );
}
