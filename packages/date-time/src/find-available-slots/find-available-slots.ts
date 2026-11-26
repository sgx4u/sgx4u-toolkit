import type { Interval } from "../types/interval.types.js";
import type { TimeOfDay, TimeRange } from "../types/time.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import { compareTimesOfDay } from "../compare-times-of-day/compare-times-of-day.js";
import { doIntervalsOverlap } from "../do-intervals-overlap/do-intervals-overlap.js";
import { parseTimeOfDay } from "../parse-time-of-day/parse-time-of-day.js";
import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { isIntervalValue, mergeIntervalList } from "../utils/interval.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FindAvailableSlotsParams } from "./find-available-slots.types.js";

const maximumSlotCount = 100_000;

/**
 * Finds free slots of a fixed length inside a window.
 *
 * Busy intervals are merged. Each slot starts at `within.start` plus a
 * multiple of `step` and must fit entirely in free time. `dailyWindow`
 * keeps only slots that stay inside that clock range.
 *
 * @param params - `busy`, `within`, and `slotDuration` are required. `step` defaults to `slotDuration`.
 * @returns The free slots, oldest first, or `undefined` when input is not usable.
 * @throws {@link RangeError} When the step does not move forward or the result would exceed 100000 slots, or `timeZone` is unusable.
 * @example
 * findAvailableSlots({
 *   busy: [{ start: new Date(10), end: new Date(20) }],
 *   within: { start: new Date(0), end: new Date(40) },
 *   slotDuration: { milliseconds: 10 },
 *   timeZone: "UTC",
 * })?.length; // 3
 */
export function findAvailableSlots({
    busy,
    within,
    slotDuration,
    step,
    dailyWindow,
    timeZone,
}: FindAvailableSlotsParams): Interval[] | undefined {
    if (!Array.isArray(busy)) {
        return undefined;
    }
    if (!isIntervalValue(within)) {
        return undefined;
    }
    const checkedSlotDuration = readDuration(slotDuration);
    if (checkedSlotDuration === undefined) {
        return undefined;
    }
    const checkedStep = readDuration(step ?? slotDuration);
    if (checkedStep === undefined) {
        return undefined;
    }
    const zone = resolveTimeZone(timeZone);
    const window =
        dailyWindow === undefined ? undefined : readWindow(dailyWindow);
    if (dailyWindow !== undefined && window === undefined) {
        return undefined;
    }
    const merged = mergeIntervalList(busy, true);
    const slots: Interval[] = [];
    let cursor = within.start.getTime();
    const end = within.end.getTime();
    while (cursor < end) {
        const slotEnd = addDuration({
            date: new Date(cursor),
            duration: checkedSlotDuration,
            timeZone: zone,
        });
        if (slotEnd === undefined) {
            return undefined;
        }
        const slotEndTime = slotEnd.getTime();
        if (slotEndTime <= cursor) {
            throw rangeError(
                "slotDuration",
                "a duration that moves time forward",
                slotDuration,
            );
        }
        if (
            slotEndTime <= end &&
            isFree(cursor, slotEndTime, merged) &&
            fitsWindow(cursor, slotEndTime, window, zone)
        ) {
            slots.push({ start: new Date(cursor), end: new Date(slotEndTime) });
            if (slots.length > maximumSlotCount) {
                throw rangeError("within", "at most 100000 slots", within);
            }
        }
        const nextDate = addDuration({
            date: new Date(cursor),
            duration: checkedStep,
            timeZone: zone,
        });
        if (nextDate === undefined) {
            return undefined;
        }
        const next = nextDate.getTime();
        if (next <= cursor) {
            throw rangeError(
                "step",
                "a duration that moves time forward",
                step ?? slotDuration,
            );
        }
        cursor = next;
    }
    return slots;
}

/**
 * @param start - The slot start.
 * @param end - The slot end.
 * @param busy - Merged busy intervals.
 * @returns `true` when the slot does not overlap any busy interval.
 */
function isFree(
    start: number,
    end: number,
    busy: readonly Interval[],
): boolean {
    const slot = { start: new Date(start), end: new Date(end) };
    return !busy.some(
        (interval) =>
            doIntervalsOverlap({ first: slot, second: interval }) === true,
    );
}

/**
 * @param start - The slot start.
 * @param end - The slot end.
 * @param window - The daily window, or `undefined` when every hour is allowed.
 * @param timeZone - The zone the window is read in.
 * @returns `true` when the whole slot stays inside the window.
 */
function fitsWindow(
    start: number,
    end: number,
    window: { start: TimeOfDay; end: TimeOfDay } | undefined,
    timeZone: string,
): boolean {
    if (window === undefined) {
        return true;
    }
    const startParts = readDateParts(start, timeZone);
    const endParts = readDateParts(end, timeZone);
    const startTime = clock(startParts);
    const endTime = clock(endParts);
    const sameDay =
        startParts.year === endParts.year &&
        startParts.month === endParts.month &&
        startParts.day === endParts.day;
    const daytime =
        compareTimesOfDay({
            first: window.end,
            second: window.start,
        }) === 1;
    if (daytime) {
        return (
            sameDay &&
            (compareTimesOfDay({
                first: startTime,
                second: window.start,
            }) ?? -1) >= 0 &&
            (compareTimesOfDay({
                first: endTime,
                second: window.end,
            }) ?? 1) <= 0
        );
    }
    const startsInside =
        (compareTimesOfDay({
            first: startTime,
            second: window.start,
        }) ?? -1) >= 0 ||
        (compareTimesOfDay({
            first: startTime,
            second: window.end,
        }) ?? 1) < 0;
    const endsInside =
        (compareTimesOfDay({
            first: endTime,
            second: window.start,
        }) ?? -1) >= 0 ||
        (compareTimesOfDay({
            first: endTime,
            second: window.end,
        }) ?? 1) <= 0;
    return startsInside && endsInside;
}

/**
 * @param parts - Wall-clock fields.
 * @returns The time of day.
 */
function clock(parts: {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}): TimeOfDay {
    return {
        hour: parts.hour,
        minute: parts.minute,
        second: parts.second,
        millisecond: parts.millisecond,
    };
}

/**
 * @param range - A daily window.
 * @returns Parsed bounds.
 */
function readWindow(
    range: TimeRange,
): { start: TimeOfDay; end: TimeOfDay } | undefined {
    const start = parseTimeOfDay(
        typeof range.start === "string"
            ? range.start
            : formatBound(range.start),
    );
    const end = parseTimeOfDay(
        typeof range.end === "string" ? range.end : formatBound(range.end),
    );
    if (start === undefined || end === undefined) {
        return undefined;
    }
    return { start, end };
}

/**
 * @param time - A time of day.
 * @returns Text `parseTimeOfDay` accepts.
 */
function formatBound(time: TimeOfDay): string {
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}.${String(time.millisecond).padStart(3, "0")}`;
}
