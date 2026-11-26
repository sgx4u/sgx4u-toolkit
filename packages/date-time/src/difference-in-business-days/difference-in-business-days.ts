import {
    businessDaysBetween,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import type { DifferenceInBusinessDaysParams } from "./difference-in-business-days.types.js";

/**
 * Counts business days in `[earlier, later)` by calendar day.
 *
 * The calendar day of `later` is excluded. The result is negative when
 * `later` is before `earlier`.
 *
 * @param params - `later` and `earlier` are the two dates, plus optional business calendar fields.
 * @returns The signed count, or `undefined` when either date is not usable.
 * @throws {@link RangeError} When 3660 consecutive days have no business day, or business calendar fields are invalid.
 * @example
 * differenceInBusinessDays({
 *   later: "2026-11-30T00:00:00Z",
 *   earlier: "2026-11-27T00:00:00Z",
 *   timeZone: "UTC",
 * }); // 1
 */
export function differenceInBusinessDays({
    later,
    earlier,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: DifferenceInBusinessDaysParams): number | undefined {
    const resolved = resolveBusinessCalendar({
        workingDays,
        businessHours,
        holidays,
        timeZone,
    });
    const laterInstant = readDateInput(later, resolved.timeZone);
    const earlierInstant = readDateInput(earlier, resolved.timeZone);
    if (laterInstant === undefined || earlierInstant === undefined) {
        return undefined;
    }
    return businessDaysBetween(
        laterInstant.getTime(),
        earlierInstant.getTime(),
        resolved,
    );
}
