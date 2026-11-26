import { calendarBoundariesBetween } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import type { DifferenceInCalendarUnitParams } from "./difference-in-calendar-unit.types.js";

const calendarUnitNames = ["year", "quarter", "month", "week", "day"] as const;

/**
 * Counts calendar boundaries crossed between two dates.
 *
 * December 31 to January 1 is one year. A week uses `weekStartsOn`.
 *
 * @param params - `later`, `earlier`, and `unit` are required. `weekStartsOn` defaults to Monday.
 * @returns The signed number of boundaries, or `undefined` when either date is not usable.
 * @throws {@link TypeError} When `unit` is not a string.
 * @throws {@link RangeError} When `unit` is not a calendar unit, `weekStartsOn` is invalid, or `timeZone` is unusable.
 * @example
 * differenceInCalendarUnit({
 *   later: "2027-01-01T00:00:00Z",
 *   earlier: "2026-12-31T00:00:00Z",
 *   unit: "year",
 *   timeZone: "UTC",
 * }); // 1
 */
export function differenceInCalendarUnit({
    later,
    earlier,
    unit,
    timeZone,
    weekStartsOn,
}: DifferenceInCalendarUnitParams): number | undefined {
    if (typeof unit !== "string") {
        throw typeError("unit", "a calendar unit", unit);
    }
    if (!(calendarUnitNames as readonly string[]).includes(unit)) {
        throw rangeError("unit", "a calendar unit", unit);
    }
    const zone = resolveTimeZone(timeZone);
    const laterInstant = readDateInput(later, zone);
    const earlierInstant = readDateInput(earlier, zone);
    if (laterInstant === undefined || earlierInstant === undefined) {
        return undefined;
    }
    return calendarBoundariesBetween(
        laterInstant.getTime(),
        earlierInstant.getTime(),
        unit,
        zone,
        resolveWeekStartsOn(weekStartsOn),
    );
}
