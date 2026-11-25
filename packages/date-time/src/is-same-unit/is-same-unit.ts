import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { startOfInstant } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";

/**
 * Reports whether two dates fall in the same unit in a time zone.
 *
 * A week uses `weekStartsOn`, which defaults to Monday. The comparison is
 * the start of that unit, so a daylight-saving day still counts as one day.
 *
 * @param first - The first date.
 * @param second - The second date.
 * @param unit - The unit to compare.
 * @param options - `timeZone` defaults to the system zone. `weekStartsOn` defaults to Monday.
 * @returns `true` when both dates share that unit.
 * @throws {@link TypeError} When a date or the unit has the wrong type.
 * @throws {@link RangeError} When a date, the unit, or the zone is invalid.
 * @example
 * isSameUnit("2024-06-15T23:00:00Z", "2024-06-16T02:00:00Z", "day", { timeZone: "Asia/Kolkata" }); // true
 */
export function isSameUnit(
    first: DateInput,
    second: DateInput,
    unit: TimeUnit,
    options?: TimeZoneOptions & WeekOptions,
): boolean {
    const timeZone = resolveTimeZone(options?.timeZone);
    const weekStartsOn = resolveWeekStartsOn(options?.weekStartsOn);
    const checkedUnit = assertTimeUnit(unit);
    const firstStart = startOfInstant(
        resolveDateInput(first, "first", timeZone).getTime(),
        checkedUnit,
        timeZone,
        weekStartsOn,
    );
    const secondStart = startOfInstant(
        resolveDateInput(second, "second", timeZone).getTime(),
        checkedUnit,
        timeZone,
        weekStartsOn,
    );
    return firstStart === secondStart;
}
