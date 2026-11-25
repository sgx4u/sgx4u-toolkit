import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    businessDaysBetween,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";

/**
 * Counts business days in `[earlier, later)` by calendar day.
 *
 * The calendar day of `later` is excluded. The result is negative when
 * `later` is before `earlier`.
 *
 * @param later - The end date.
 * @param earlier - The start date.
 * @param calendar - Weekend days, holidays, and the zone.
 * @returns The signed count.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 * @example
 * differenceInBusinessDays("2026-11-30T00:00:00Z", "2026-11-27T00:00:00Z", { timeZone: "UTC" }); // 1
 */
export function differenceInBusinessDays(
    later: DateInput,
    earlier: DateInput,
    calendar?: BusinessCalendar,
): number {
    const resolved = resolveBusinessCalendar(calendar);
    return businessDaysBetween(
        resolveDateInput(later, "later", resolved.timeZone).getTime(),
        resolveDateInput(earlier, "earlier", resolved.timeZone).getTime(),
        resolved,
    );
}
