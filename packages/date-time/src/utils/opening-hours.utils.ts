import type { WeeklySchedule } from "../types/schedule.types.js";
import type {
    CalendarDate,
    TimeOfDay,
    TimeRange,
} from "../types/time.types.js";
import { compareTimesOfDay } from "../compare-times-of-day/compare-times-of-day.js";
import { parseTimeOfDay } from "../parse-time-of-day/parse-time-of-day.js";
import { addDurationToInstant, startOfInstant } from "./arithmetic.utils.js";
import { rangeError } from "./error.utils.js";
import { instantFromWallTime, readDateParts } from "./time-zone.utils.js";

const searchDays = 400;

/**
 * One open interval produced by a weekly schedule.
 */
interface OpenSegment {
    start: number;
    end: number;
}

/**
 * Whether a schedule is open at an instant.
 *
 * A closure removes that calendar day and any overnight range that starts
 * on it. An overnight range from the previous day still covers this morning
 * when today itself is not closed.
 *
 * @param epochMilliseconds - The instant to test.
 * @param schedule - Weekly hours and closures.
 * @param timeZone - The zone the schedule is read in.
 * @returns `true` when the instant is open.
 */
export function scheduleIsOpen(
    epochMilliseconds: number,
    schedule: WeeklySchedule,
    timeZone: string,
): boolean {
    return (
        segmentContaining(epochMilliseconds, schedule, timeZone) !== undefined
    );
}

/**
 * The next time the schedule opens.
 *
 * @param epochMilliseconds - The instant to search from.
 * @param schedule - Weekly hours and closures.
 * @param timeZone - The zone the schedule is read in.
 * @returns The next opening, or `undefined` when none exists within 400 days.
 */
export function nextOpening(
    epochMilliseconds: number,
    schedule: WeeklySchedule,
    timeZone: string,
): number | undefined {
    return nextSegment(epochMilliseconds, schedule, timeZone)?.start;
}

/**
 * The next time the schedule closes.
 *
 * When the instant is open, this is the end of the current open interval.
 * Otherwise it is the end of the next one.
 *
 * @param epochMilliseconds - The instant to search from.
 * @param schedule - Weekly hours and closures.
 * @param timeZone - The zone the schedule is read in.
 * @returns The next closing, or `undefined` when none exists within 400 days.
 */
export function nextClosing(
    epochMilliseconds: number,
    schedule: WeeklySchedule,
    timeZone: string,
): number | undefined {
    const current = segmentContaining(epochMilliseconds, schedule, timeZone);
    if (current !== undefined) {
        return current.end;
    }
    return nextSegment(epochMilliseconds, schedule, timeZone)?.end;
}

/**
 * @param epochMilliseconds - The instant.
 * @param schedule - Weekly hours and closures.
 * @param timeZone - The zone the schedule is read in.
 * @returns The open segment containing the instant.
 */
function segmentContaining(
    epochMilliseconds: number,
    schedule: WeeklySchedule,
    timeZone: string,
): OpenSegment | undefined {
    const day = startOfInstant(epochMilliseconds, "day", timeZone, 1);
    const previous = addDurationToInstant(
        day,
        { days: -1 },
        timeZone,
        "compatible",
        "constrain",
    );
    for (const segment of segmentsStartingOn(day, schedule, timeZone).concat(
        segmentsStartingOn(previous, schedule, timeZone),
    )) {
        if (
            epochMilliseconds >= segment.start &&
            epochMilliseconds < segment.end
        ) {
            return segment;
        }
    }
    return undefined;
}

/**
 * @param epochMilliseconds - The earliest instant that counts.
 * @param schedule - Weekly hours and closures.
 * @param timeZone - The zone the schedule is read in.
 * @returns The next segment whose start is not before the instant.
 */
function nextSegment(
    epochMilliseconds: number,
    schedule: WeeklySchedule,
    timeZone: string,
): OpenSegment | undefined {
    let day = startOfInstant(epochMilliseconds, "day", timeZone, 1);
    let earliest: OpenSegment | undefined;
    for (let step = 0; step <= searchDays; step += 1) {
        for (const segment of segmentsStartingOn(day, schedule, timeZone)) {
            if (segment.start < epochMilliseconds) {
                continue;
            }
            if (earliest === undefined || segment.start < earliest.start) {
                earliest = segment;
            }
        }
        if (earliest !== undefined && earliest.start < day + 86_400_000 * 2) {
            return earliest;
        }
        day = addDurationToInstant(
            day,
            { days: 1 },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    return earliest;
}

/**
 * Open segments that start on a calendar day.
 *
 * An overnight range is one segment from its start through the next morning.
 * A closure on this day removes them.
 *
 * @param dayStart - The start of the calendar day.
 * @param schedule - Weekly hours and closures.
 * @param timeZone - The zone the schedule is read in.
 * @returns The segments, which may extend into the next day.
 */
function segmentsStartingOn(
    dayStart: number,
    schedule: WeeklySchedule,
    timeZone: string,
): OpenSegment[] {
    const parts = readDateParts(dayStart, timeZone);
    if (isClosure(parts, schedule.closures)) {
        return [];
    }
    const ranges = schedule.hours[parts.weekday] ?? [];
    const nextDay = addDurationToInstant(
        dayStart,
        { days: 1 },
        timeZone,
        "compatible",
        "constrain",
    );
    const segments: OpenSegment[] = [];
    for (const range of ranges) {
        const bounds = readRange(range);
        const start = timeOnDay(dayStart, bounds.start, timeZone);
        const compared = compareTimesOfDay({
            first: bounds.end,
            second: bounds.start,
        });
        if (compared !== undefined && compared > 0) {
            segments.push({
                start,
                end: timeOnDay(dayStart, bounds.end, timeZone),
            });
        } else {
            const nextParts = readDateParts(nextDay, timeZone);
            if (isClosure(nextParts, schedule.closures)) {
                segments.push({ start, end: nextDay });
            } else {
                segments.push({
                    start,
                    end: timeOnDay(nextDay, bounds.end, timeZone),
                });
            }
        }
    }
    return mergeSegments(segments);
}

/**
 * @param date - A calendar day.
 * @param closures - Whole days that are closed.
 * @returns `true` when the day is listed.
 */
function isClosure(
    date: CalendarDate,
    closures: readonly CalendarDate[] | undefined,
): boolean {
    return (closures ?? []).some(
        (closure) =>
            closure.year === date.year &&
            closure.month === date.month &&
            closure.day === date.day,
    );
}

/**
 * @param range - A weekly range.
 * @returns Parsed bounds.
 */
function readRange(range: TimeRange): { start: TimeOfDay; end: TimeOfDay } {
    const start = parseTimeOfDay(boundText(range.start));
    const end = parseTimeOfDay(boundText(range.end));
    if (start === undefined || end === undefined) {
        throw rangeError("schedule.hours", "time ranges", range);
    }
    return { start, end };
}

/**
 * @param bound - A range bound.
 * @returns Text `parseTimeOfDay` accepts.
 */
function boundText(bound: TimeRange["start"]): string {
    if (typeof bound === "string") {
        return bound;
    }
    return `${String(bound.hour).padStart(2, "0")}:${String(bound.minute).padStart(2, "0")}:${String(bound.second).padStart(2, "0")}.${String(bound.millisecond).padStart(3, "0")}`;
}

/**
 * @param dayStart - The start of the calendar day.
 * @param time - The clock time.
 * @param timeZone - The zone.
 * @returns The instant.
 */
function timeOnDay(
    dayStart: number,
    time: TimeOfDay,
    timeZone: string,
): number {
    const parts = readDateParts(dayStart, timeZone);
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
        timeZone,
        "compatible",
    );
}

/**
 * @param segments - Segments that may touch.
 * @returns The same coverage with overlaps joined.
 */
function mergeSegments(segments: readonly OpenSegment[]): OpenSegment[] {
    const sorted = [...segments].sort(
        (first, second) => first.start - second.start,
    );
    const merged: OpenSegment[] = [];
    for (const segment of sorted) {
        const last = merged[merged.length - 1];
        if (last !== undefined && segment.start <= last.end) {
            last.end = Math.max(last.end, segment.end);
            continue;
        }
        merged.push({ ...segment });
    }
    return merged;
}
