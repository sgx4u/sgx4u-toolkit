import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    businessHoursBetween,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Returns the working hours between two dates.
 *
 * Only time inside working hours counts. The result is fractional and
 * negative when `later` is before `earlier`.
 *
 * @param later - The end date.
 * @param earlier - The start date.
 * @param calendar - Working hours, weekend days, holidays, and the zone.
 * @returns Signed hours.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 * @example
 * differenceInBusinessHours("2026-11-27T10:00:00Z", "2026-11-26T16:00:00Z", { timeZone: "UTC" }); // 2
 */
export function differenceInBusinessHours(
    later: DateInput,
    earlier: DateInput,
    calendar?: BusinessCalendar,
): number {
    const resolved = resolveBusinessCalendar(calendar);
    return businessHoursBetween(
        resolveDateInput(later, "later", resolved.timeZone).getTime(),
        resolveDateInput(earlier, "earlier", resolved.timeZone).getTime(),
        resolved,
    );
}
