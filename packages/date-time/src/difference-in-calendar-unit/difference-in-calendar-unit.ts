import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { CalendarUnit } from "../types/time.types.js";
import { calendarBoundariesBetween } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";

const calendarUnitNames = ["year", "quarter", "month", "week", "day"] as const;

/**
 * Counts calendar boundaries crossed between two dates.
 *
 * December 31 to January 1 is one year. A week uses `weekStartsOn`.
 *
 * @param later - The end instant.
 * @param earlier - The start instant.
 * @param unit - `"year"`, `"quarter"`, `"month"`, `"week"`, or `"day"`.
 * @param options - `weekStartsOn` defaults to Monday.
 * @returns The signed number of boundaries.
 * @throws {@link TypeError} When a date or the unit has the wrong type.
 * @throws {@link RangeError} When a value is invalid.
 * @example
 * differenceInCalendarUnit("2027-01-01T00:00:00Z", "2026-12-31T00:00:00Z", "year", { timeZone: "UTC" }); // 1
 */
export function differenceInCalendarUnit(
    later: DateInput,
    earlier: DateInput,
    unit: CalendarUnit,
    options?: TimeZoneOptions & WeekOptions,
): number {
    if (typeof unit !== "string") {
        throw typeError("unit", "a calendar unit", unit);
    }
    if (!(calendarUnitNames as readonly string[]).includes(unit)) {
        throw rangeError("unit", "a calendar unit", unit);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    return calendarBoundariesBetween(
        resolveDateInput(later, "later", timeZone).getTime(),
        resolveDateInput(earlier, "earlier", timeZone).getTime(),
        unit,
        timeZone,
        resolveWeekStartsOn(options?.weekStartsOn),
    );
}
