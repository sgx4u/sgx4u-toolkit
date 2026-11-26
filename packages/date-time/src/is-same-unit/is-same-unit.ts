import type { DateInput } from "../types/date-input.types.js";
import type { TimeUnit, Weekday } from "../types/time.types.js";
import { startOfInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";

/**
 * Fields for {@link isSameUnit}.
 */
export interface IsSameUnitParams {
    /**
     * The first date.
     */
    first: DateInput;
    /**
     * The second date.
     */
    second: DateInput;
    /**
     * The unit to compare.
     */
    unit: TimeUnit;
    /**
     * Zone used to read unit boundaries.
     */
    timeZone?: string;
    /**
     * ISO weekday that starts the week.
     */
    weekStartsOn?: Weekday;
}

/**
 * Reports whether two dates fall in the same unit in a time zone.
 *
 * A week uses `weekStartsOn`, which defaults to Monday. The comparison is
 * the start of that unit, so a daylight-saving day still counts as one day.
 *
 * @param params - `first`, `second`, and `unit` are required.
 * @returns `true` when both dates share that unit.
 * @throws {@link RangeError} When the unit, zone, or `weekStartsOn` is invalid.
 * @example
 * isSameUnit({
 *   first: "2024-06-15T23:00:00Z",
 *   second: "2024-06-16T02:00:00Z",
 *   unit: "day",
 *   timeZone: "Asia/Kolkata",
 * }); // true
 */
export function isSameUnit({
    first,
    second,
    unit,
    timeZone,
    weekStartsOn,
}: IsSameUnitParams): boolean {
    const zone = resolveTimeZone(timeZone);
    const checkedWeekStartsOn = resolveWeekStartsOn(weekStartsOn);
    const checkedUnit = assertTimeUnit(unit);
    const firstInstant = readDateInput(first, zone);
    const secondInstant = readDateInput(second, zone);
    if (firstInstant === undefined || secondInstant === undefined) {
        return false;
    }
    const firstStart = startOfInstant(
        firstInstant.getTime(),
        checkedUnit,
        zone,
        checkedWeekStartsOn,
    );
    const secondStart = startOfInstant(
        secondInstant.getTime(),
        checkedUnit,
        zone,
        checkedWeekStartsOn,
    );
    return firstStart === secondStart;
}