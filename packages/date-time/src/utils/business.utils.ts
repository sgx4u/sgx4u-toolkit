import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { TimeOfDay, TimeRange, Weekday } from "../types/time.types.js";
import { compareTimesOfDay } from "../compare-times-of-day/compare-times-of-day.js";
import { isTimeOfDayInRange } from "../is-time-of-day-in-range/is-time-of-day-in-range.js";
import { parseTimeOfDay } from "../parse-time-of-day/parse-time-of-day.js";
import { addDurationToInstant, startOfInstant } from "./arithmetic.utils.js";
import { resolveDateInput } from "./date-input.utils.js";
import { rangeError } from "./error.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "./time-zone.utils.js";

const defaultWeekend: readonly Weekday[] = [6, 7];
const defaultWorkingHours: readonly TimeRange[] = [
    { start: "09:00", end: "17:00" },
];
const maximumClosedDays = 3_660;

/**
 * A business calendar with its defaults filled in.
 */
export interface ResolvedBusinessCalendar {
    weekendDays: readonly Weekday[];
    holidays: readonly DateInput[] | ((date: Date) => boolean);
    workingHours: readonly TimeRange[];
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
        workingHours: calendar?.workingHours ?? defaultWorkingHours,
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

/**
 * Start of the next or previous business day.
 *
 * @param epochMilliseconds - The instant to move from.
 * @param direction - `1` moves forward and `-1` moves backward.
 * @param calendar - The resolved calendar.
 * @returns The start of that business day.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 */
export function adjacentBusinessDayStart(
    epochMilliseconds: number,
    direction: 1 | -1,
    calendar: ResolvedBusinessCalendar,
): number {
    let cursor = startOfInstant(epochMilliseconds, "day", calendar.timeZone, 1);
    let closedRun = 0;
    while (closedRun <= maximumClosedDays) {
        cursor = addDurationToInstant(
            cursor,
            { days: direction },
            calendar.timeZone,
            "compatible",
            "constrain",
        );
        if (isBusinessInstant(cursor, calendar)) {
            return cursor;
        }
        closedRun += 1;
    }
    throw closedCalendarError();
}

/**
 * Business days in `[earlier, later)` by calendar day.
 *
 * @param laterEpoch - The end instant.
 * @param earlierEpoch - The start instant.
 * @param calendar - The resolved calendar.
 * @returns The signed count. The calendar day of `later` is excluded.
 */
export function businessDaysBetween(
    laterEpoch: number,
    earlierEpoch: number,
    calendar: ResolvedBusinessCalendar,
): number {
    const sign = laterEpoch >= earlierEpoch ? 1 : -1;
    const start = startOfInstant(
        Math.min(laterEpoch, earlierEpoch),
        "day",
        calendar.timeZone,
        1,
    );
    const end = startOfInstant(
        Math.max(laterEpoch, earlierEpoch),
        "day",
        calendar.timeZone,
        1,
    );
    let cursor = start;
    let count = 0;
    let closedRun = 0;
    while (cursor < end) {
        if (isBusinessInstant(cursor, calendar)) {
            count += 1;
            closedRun = 0;
        } else {
            closedRun += 1;
            if (closedRun > maximumClosedDays) {
                throw closedCalendarError();
            }
        }
        cursor = addDurationToInstant(
            cursor,
            { days: 1 },
            calendar.timeZone,
            "compatible",
            "constrain",
        );
    }
    return sign * count;
}

/**
 * Whether an instant is inside working hours on a business day.
 *
 * An empty `workingHours` list means the whole business day counts.
 *
 * @param epochMilliseconds - The instant to test.
 * @param calendar - The resolved calendar.
 * @returns `true` when the instant is open.
 */
export function isInsideWorkingHours(
    epochMilliseconds: number,
    calendar: ResolvedBusinessCalendar,
): boolean {
    return workingSegment(epochMilliseconds, calendar) !== undefined;
}

/**
 * The instant itself when it is open, otherwise the next opening.
 *
 * @param epochMilliseconds - The instant to measure from.
 * @param calendar - The resolved calendar.
 * @returns The next open instant.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 */
export function nextBusinessOpening(
    epochMilliseconds: number,
    calendar: ResolvedBusinessCalendar,
): number {
    if (isInsideWorkingHours(epochMilliseconds, calendar)) {
        return epochMilliseconds;
    }
    let day = startOfInstant(epochMilliseconds, "day", calendar.timeZone, 1);
    let closedRun = 0;
    for (let step = 0; step <= maximumClosedDays; step += 1) {
        if (isBusinessInstant(day, calendar)) {
            closedRun = 0;
            const opening = earliestOpeningOnOrAfter(
                day,
                epochMilliseconds,
                calendar,
            );
            if (opening !== undefined) {
                return opening;
            }
        } else {
            closedRun += 1;
            if (closedRun > maximumClosedDays) {
                throw closedCalendarError();
            }
        }
        day = addDurationToInstant(
            day,
            { days: 1 },
            calendar.timeZone,
            "compatible",
            "constrain",
        );
    }
    throw closedCalendarError();
}

/**
 * Moves by working time only.
 *
 * @param epochMilliseconds - The start instant.
 * @param milliseconds - Signed working time. Calendar units are rejected by the caller.
 * @param calendar - The resolved calendar.
 * @returns The resulting instant.
 * @throws {@link RangeError} When 3660 consecutive days have no business day.
 */
export function addBusinessMilliseconds(
    epochMilliseconds: number,
    milliseconds: number,
    calendar: ResolvedBusinessCalendar,
): number {
    if (milliseconds === 0) {
        return epochMilliseconds;
    }
    if (milliseconds > 0) {
        return moveForwardThroughBusinessHours(
            epochMilliseconds,
            milliseconds,
            calendar,
        );
    }
    return moveBackwardThroughBusinessHours(
        epochMilliseconds,
        -milliseconds,
        calendar,
    );
}

/**
 * Working hours between two instants.
 *
 * @param laterEpoch - The end instant.
 * @param earlierEpoch - The start instant.
 * @param calendar - The resolved calendar.
 * @returns Signed hours. A fraction is a partial hour.
 */
export function businessHoursBetween(
    laterEpoch: number,
    earlierEpoch: number,
    calendar: ResolvedBusinessCalendar,
): number {
    const sign = laterEpoch >= earlierEpoch ? 1 : -1;
    const start = Math.min(laterEpoch, earlierEpoch);
    const end = Math.max(laterEpoch, earlierEpoch);
    let cursor = start;
    let total = 0;
    let steps = 0;
    while (cursor < end) {
        const opening = nextBusinessOpening(cursor, calendar);
        if (opening >= end) {
            break;
        }
        const segment = workingSegment(opening, calendar);
        if (segment === undefined) {
            break;
        }
        const pieceEnd = Math.min(segment.end, end);
        total += pieceEnd - opening;
        cursor = segment.end;
        steps += 1;
        if (steps > maximumClosedDays) {
            throw closedCalendarError();
        }
    }
    return (sign * total) / 3_600_000;
}

/**
 * @returns The error used when a calendar has no business day.
 */
/**
 * @param epochMilliseconds - The start instant.
 * @param milliseconds - Positive working time.
 * @param calendar - The resolved calendar.
 * @returns The instant after that much working time.
 */
function moveForwardThroughBusinessHours(
    epochMilliseconds: number,
    milliseconds: number,
    calendar: ResolvedBusinessCalendar,
): number {
    let remaining = milliseconds;
    let cursor = nextBusinessOpening(epochMilliseconds, calendar);
    let steps = 0;
    while (remaining > 0) {
        const segment = workingSegment(cursor, calendar);
        if (segment === undefined) {
            cursor = nextBusinessOpening(cursor, calendar);
            continue;
        }
        const available = segment.end - cursor;
        if (remaining <= available) {
            return cursor + remaining;
        }
        remaining -= available;
        cursor = nextBusinessOpening(segment.end, calendar);
        steps += 1;
        if (steps > maximumClosedDays) {
            throw closedCalendarError();
        }
    }
    return cursor;
}

/**
 * @param epochMilliseconds - The start instant.
 * @param milliseconds - Positive working time to move backward.
 * @param calendar - The resolved calendar.
 * @returns The instant that much working time earlier.
 */
function moveBackwardThroughBusinessHours(
    epochMilliseconds: number,
    milliseconds: number,
    calendar: ResolvedBusinessCalendar,
): number {
    let remaining = milliseconds;
    let cursor = epochMilliseconds;
    let steps = 0;
    while (remaining > 0) {
        const segment = workingSegment(cursor, calendar);
        if (segment !== undefined && cursor > segment.start) {
            const available = cursor - segment.start;
            if (remaining <= available) {
                return cursor - remaining;
            }
            remaining -= available;
            cursor = segment.start;
            continue;
        }
        const previous = previousWorkingSegment(cursor, calendar);
        const available = previous.end - previous.start;
        if (remaining <= available) {
            return previous.end - remaining;
        }
        remaining -= available;
        cursor = previous.start;
        steps += 1;
        if (steps > maximumClosedDays) {
            throw closedCalendarError();
        }
    }
    return cursor;
}

/**
 * The latest working segment that ends at or before an instant.
 *
 * @param epochMilliseconds - The exclusive upper bound.
 * @param calendar - The resolved calendar.
 * @returns That segment.
 * @throws {@link RangeError} When no earlier business day exists within the guard.
 */
function previousWorkingSegment(
    epochMilliseconds: number,
    calendar: ResolvedBusinessCalendar,
): { start: number; end: number } {
    let day = startOfInstant(epochMilliseconds, "day", calendar.timeZone, 1);
    let closedRun = 0;
    for (let step = 0; step <= maximumClosedDays; step += 1) {
        const segments = segmentsTouchingDay(day, calendar);
        let best: { start: number; end: number } | undefined;
        for (const segment of segments) {
            if (
                segment.end <= epochMilliseconds &&
                segment.start < epochMilliseconds
            ) {
                if (best === undefined || segment.end > best.end) {
                    best = segment;
                }
            }
        }
        if (best !== undefined) {
            return best;
        }
        if (!isBusinessInstant(day, calendar)) {
            closedRun += 1;
            if (closedRun > maximumClosedDays) {
                throw closedCalendarError();
            }
        } else {
            closedRun = 0;
        }
        day = addDurationToInstant(
            day,
            { days: -1 },
            calendar.timeZone,
            "compatible",
            "constrain",
        );
    }
    throw closedCalendarError();
}

/**
 * Working segments that occur on a calendar day, including a previous
 * overnight range that ends this morning.
 *
 * @param dayStart - The start of the calendar day.
 * @param calendar - The resolved calendar.
 * @returns The segments.
 */
function segmentsTouchingDay(
    dayStart: number,
    calendar: ResolvedBusinessCalendar,
): { start: number; end: number }[] {
    const nextDay = addDurationToInstant(
        dayStart,
        { days: 1 },
        calendar.timeZone,
        "compatible",
        "constrain",
    );
    const segments: { start: number; end: number }[] = [];
    if (calendar.workingHours.length === 0) {
        if (isBusinessInstant(dayStart, calendar)) {
            segments.push({ start: dayStart, end: nextDay });
        }
        return segments;
    }
    if (isBusinessInstant(dayStart, calendar)) {
        for (const range of readRanges(calendar)) {
            if (range.overnight) {
                segments.push({
                    start: timeOnDay(dayStart, range.start, calendar),
                    end: nextDay,
                });
            } else {
                segments.push({
                    start: timeOnDay(dayStart, range.start, calendar),
                    end: timeOnDay(dayStart, range.end, calendar),
                });
            }
        }
    }
    const previousDay = addDurationToInstant(
        dayStart,
        { days: -1 },
        calendar.timeZone,
        "compatible",
        "constrain",
    );
    if (isBusinessInstant(previousDay, calendar)) {
        for (const range of readRanges(calendar)) {
            if (range.overnight) {
                segments.push({
                    start: dayStart,
                    end: timeOnDay(dayStart, range.end, calendar),
                });
            }
        }
    }
    return segments;
}

/**
 * @returns The error used when a calendar has no business day.
 */
function closedCalendarError(): RangeError {
    return new RangeError(
        "`calendar` must contain a business day; received 3660 consecutive non-business days.",
    );
}

/**
 * The working segment that contains an instant, if it is open.
 *
 * @param epochMilliseconds - The instant.
 * @param calendar - The resolved calendar.
 * @returns The segment, or `undefined` when the instant is closed.
 */
function workingSegment(
    epochMilliseconds: number,
    calendar: ResolvedBusinessCalendar,
): { start: number; end: number } | undefined {
    const day = startOfInstant(epochMilliseconds, "day", calendar.timeZone, 1);
    const nextDay = addDurationToInstant(
        day,
        { days: 1 },
        calendar.timeZone,
        "compatible",
        "constrain",
    );
    if (calendar.workingHours.length === 0) {
        return isBusinessInstant(epochMilliseconds, calendar)
            ? { start: day, end: nextDay }
            : undefined;
    }
    const time = timeOn(epochMilliseconds, calendar);
    if (isBusinessInstant(epochMilliseconds, calendar)) {
        for (const range of readRanges(calendar)) {
            if (!range.overnight && containsDaytime(time, range)) {
                return {
                    start: timeOnDay(day, range.start, calendar),
                    end: timeOnDay(day, range.end, calendar),
                };
            }
            if (range.overnight && compareTimesOfDay(time, range.start) >= 0) {
                return {
                    start: timeOnDay(day, range.start, calendar),
                    end: nextDay,
                };
            }
        }
    }
    const previousDay = addDurationToInstant(
        day,
        { days: -1 },
        calendar.timeZone,
        "compatible",
        "constrain",
    );
    if (isBusinessInstant(previousDay, calendar)) {
        for (const range of readRanges(calendar)) {
            if (range.overnight && compareTimesOfDay(time, range.end) < 0) {
                return {
                    start: day,
                    end: timeOnDay(day, range.end, calendar),
                };
            }
        }
    }
    return undefined;
}

/**
 * @param dayStart - The start of a business day.
 * @param earliest - Openings before this instant are ignored.
 * @param calendar - The resolved calendar.
 * @returns The earliest opening at or after `earliest`, if one exists that day.
 */
function earliestOpeningOnOrAfter(
    dayStart: number,
    earliest: number,
    calendar: ResolvedBusinessCalendar,
): number | undefined {
    const nextDay = addDurationToInstant(
        dayStart,
        { days: 1 },
        calendar.timeZone,
        "compatible",
        "constrain",
    );
    if (calendar.workingHours.length === 0) {
        return dayStart >= earliest ? dayStart : undefined;
    }
    let earliestOpening: number | undefined;
    for (const range of readRanges(calendar)) {
        const opening = timeOnDay(dayStart, range.start, calendar);
        if (
            opening >= earliest &&
            (earliestOpening === undefined || opening < earliestOpening)
        ) {
            earliestOpening = opening;
        }
        if (range.overnight && dayStart >= earliest && dayStart < nextDay) {
            const morning = dayStart;
            if (earliestOpening === undefined || morning < earliestOpening) {
                earliestOpening =
                    morning >= earliest ? morning : earliestOpening;
            }
        }
    }
    return earliestOpening;
}

/**
 * A working window with its bounds parsed.
 */
interface ParsedWorkingRange {
    start: TimeOfDay;
    end: TimeOfDay;
    overnight: boolean;
}

/**
 * @param calendar - The resolved calendar.
 * @returns Parsed working windows.
 */
function readRanges(calendar: ResolvedBusinessCalendar): ParsedWorkingRange[] {
    return calendar.workingHours.map((range) => {
        const start = parseTimeOfDay(
            typeof range.start === "string"
                ? range.start
                : formatBound(range.start),
        );
        const end = parseTimeOfDay(
            typeof range.end === "string" ? range.end : formatBound(range.end),
        );
        if (start === undefined || end === undefined) {
            throw rangeError("workingHours", "ranges of HH:mm", range);
        }
        return {
            start,
            end,
            overnight: compareTimesOfDay(end, start) <= 0,
        };
    });
}

/**
 * @param time - A time of day.
 * @returns `HH:mm:ss.SSS` text that `parseTimeOfDay` accepts.
 */
function formatBound(time: TimeOfDay): string {
    return `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}.${String(time.millisecond).padStart(3, "0")}`;
}

/**
 * @param value - A number from 0 to 59.
 * @returns Two digits.
 */
function pad(value: number): string {
    return String(value).padStart(2, "0");
}

/**
 * @param epochMilliseconds - The instant.
 * @param calendar - The resolved calendar.
 * @returns Its wall-clock time.
 */
function timeOn(
    epochMilliseconds: number,
    calendar: ResolvedBusinessCalendar,
): TimeOfDay {
    const parts = readDateParts(epochMilliseconds, calendar.timeZone);
    return {
        hour: parts.hour,
        minute: parts.minute,
        second: parts.second,
        millisecond: parts.millisecond,
    };
}

/**
 * @param dayStart - The start of the calendar day.
 * @param time - The clock time on that day.
 * @param calendar - The resolved calendar.
 * @returns The instant.
 */
function timeOnDay(
    dayStart: number,
    time: TimeOfDay,
    calendar: ResolvedBusinessCalendar,
): number {
    const parts = readDateParts(dayStart, calendar.timeZone);
    return instantFromWallTime(
        {
            year: parts.year,
            month: parts.month,
            day: parts.day,
            hour: time.hour,
            minute: time.minute,
            second: time.second,
            millisecond: time.millisecond,
        },
        calendar.timeZone,
        "compatible",
    );
}

/**
 * @param time - The clock time.
 * @param range - A daytime range.
 * @returns `true` when the time is inside the range, excluding the end.
 */
function containsDaytime(time: TimeOfDay, range: ParsedWorkingRange): boolean {
    return isTimeOfDayInRange(time, { start: range.start, end: range.end });
}
