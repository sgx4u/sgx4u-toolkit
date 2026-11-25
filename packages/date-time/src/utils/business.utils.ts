import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Weekday } from "../types/time.types.js";
import { addDurationToInstant } from "./arithmetic.utils.js";
import { resolveDateInput } from "./date-input.utils.js";
import { readDateParts, resolveTimeZone } from "./time-zone.utils.js";

const defaultWeekend: readonly Weekday[] = [6, 7];
const maximumClosedDays = 3_660;

/**
 * A business calendar with its defaults filled in.
 */
export interface ResolvedBusinessCalendar {
    weekendDays: readonly Weekday[];
    holidays: readonly DateInput[] | ((date: Date) => boolean);
    timeZone: string;
}

/**
 * @param calendar - The caller's calendar, or `undefined` for the defaults.
 * @returns Weekend days, holidays, and the zone.
 */
export function resolveBusinessCalendar(
    calendar: BusinessCalendar | undefined,
): ResolvedBusinessCalendar {
    return {
        weekendDays: calendar?.weekendDays ?? defaultWeekend,
        holidays: calendar?.holidays ?? [],
        timeZone: resolveTimeZone(calendar?.timeZone),
    };
}

/**
 * Whether a calendar day is a business day.
 *
 * @param epochMilliseconds - The instant whose calendar day is tested.
 * @param calendar - The resolved calendar.
 * @returns `false` on a weekend day or a holiday.
 */
export function isBusinessInstant(
    epochMilliseconds: number,
    calendar: ResolvedBusinessCalendar,
): boolean {
    const parts = readDateParts(epochMilliseconds, calendar.timeZone);
    if (calendar.weekendDays.includes(parts.weekday)) {
        return false;
    }
    return !matchesHoliday(epochMilliseconds, parts, calendar);
}

/**
 * Moves a whole number of business days, keeping the time of day.
 *
 * Zero returns the same instant. Otherwise each step moves one calendar
 * day. A start on a non-business day does not count; the first counted
 * step is the next business day in that direction.
 *
 * @param epochMilliseconds - The start instant.
 * @param amount - Business days to move. Negative moves backward.
 * @param calendar - The resolved calendar.
 * @returns The resulting instant.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 */
export function addBusinessInstant(
    epochMilliseconds: number,
    amount: number,
    calendar: ResolvedBusinessCalendar,
): number {
    if (amount === 0) {
        return epochMilliseconds;
    }
    const direction = amount > 0 ? 1 : -1;
    let remaining = Math.abs(amount);
    let cursor = epochMilliseconds;
    let closedRun = 0;
    while (remaining > 0) {
        cursor = addDurationToInstant(
            cursor,
            { days: direction },
            calendar.timeZone,
            "compatible",
            "constrain",
        );
        if (isBusinessInstant(cursor, calendar)) {
            remaining -= 1;
            closedRun = 0;
            continue;
        }
        closedRun += 1;
        if (closedRun > maximumClosedDays) {
            throw new RangeError(
                "`calendar` must contain a business day; received 3660 consecutive non-business days.",
            );
        }
    }
    return cursor;
}

/**
 * @param epochMilliseconds - The instant being tested.
 * @param parts - Its wall-clock fields.
 * @param calendar - The resolved calendar.
 * @returns `true` when the calendar day is a holiday.
 */
function matchesHoliday(
    epochMilliseconds: number,
    parts: { year: number; month: number; day: number },
    calendar: ResolvedBusinessCalendar,
): boolean {
    const holidays = calendar.holidays;
    if (typeof holidays === "function") {
        return holidays(new Date(epochMilliseconds));
    }
    for (const holiday of holidays) {
        const holidayParts = readDateParts(
            resolveDateInput(holiday, "holidays", calendar.timeZone).getTime(),
            calendar.timeZone,
        );
        if (
            holidayParts.year === parts.year &&
            holidayParts.month === parts.month &&
            holidayParts.day === parts.day
        ) {
            return true;
        }
    }
    return false;
}
