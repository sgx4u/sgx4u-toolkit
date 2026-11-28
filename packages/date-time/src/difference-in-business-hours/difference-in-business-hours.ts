import {
    businessHoursBetween,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import type { DifferenceInBusinessHoursParams } from "./difference-in-business-hours.types.js";

/**
 * Returns the working hours between two dates.
 *
 * Only time inside working hours counts. The result is fractional and
 * negative when `later` is before `earlier`.
 *
 * @param params - `later` and `earlier` are the two dates, plus optional business calendar fields.
 * @returns Signed hours, or `undefined` when either date is not usable.
 * @throws {@link RangeError} When 3660 consecutive days have no business day, or business calendar fields are invalid.
 * @example
 * differenceInBusinessHours({
 *   later: "2026-11-27T10:00:00Z",
 *   earlier: "2026-11-26T16:00:00Z",
 *   timeZone: "UTC",
 * }); // 2
 */
export function differenceInBusinessHours({
    later,
    earlier,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: DifferenceInBusinessHoursParams): number | undefined {
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
    return businessHoursBetween(
        laterInstant.getTime(),
        earlierInstant.getTime(),
        resolved,
    );
}
