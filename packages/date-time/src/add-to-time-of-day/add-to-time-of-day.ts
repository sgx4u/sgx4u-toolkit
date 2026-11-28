import type { TimeOfDay } from "../types/time.types.js";
import { clockMilliseconds, readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { AddToTimeOfDayParams } from "./add-to-time-of-day.types.js";

const millisecondsPerDay = 86_400_000;

/**
 * Adds a duration to a time of day, wrapping past midnight.
 *
 * Months and years are rejected because a time of day has no calendar date.
 * Weeks and days become part of `dayOffset`.
 *
 * @param params - `time` and `duration`.
 * @returns The wrapped time and how many calendar days were crossed, or `undefined` when `time` or `duration` is not usable. Negative durations cross backward.
 * @throws {@link RangeError} When the duration contains months or years.
 * @example
 * addToTimeOfDay({
 *   time: { hour: 23, minute: 30, second: 0, millisecond: 0 },
 *   duration: { hours: 2 },
 * }); // { time: { hour: 1, minute: 30, second: 0, millisecond: 0 }, dayOffset: 1 }
 */
export function addToTimeOfDay({
    time,
    duration,
}: AddToTimeOfDayParams): { time: TimeOfDay; dayOffset: number } | undefined {
    if (!isTimeOfDayValue(time)) {
        return undefined;
    }
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    if ((checked.years ?? 0) !== 0 || (checked.months ?? 0) !== 0) {
        throw rangeError("duration", "free of months and years", duration);
    }
    const total =
        time.hour * 3_600_000 +
        time.minute * 60_000 +
        time.second * 1_000 +
        time.millisecond +
        clockMilliseconds(checked) +
        (checked.days ?? 0) * millisecondsPerDay +
        (checked.weeks ?? 0) * 7 * millisecondsPerDay;
    const dayOffset = Math.floor(total / millisecondsPerDay);
    const remainder = total - dayOffset * millisecondsPerDay;
    return { time: timeFromMilliseconds(remainder), dayOffset };
}

/**
 * @param time - A candidate time of day.
 * @returns `true` when every field is a finite number.
 */
function isTimeOfDayValue(time: unknown): time is TimeOfDay {
    if (time === null || typeof time !== "object") {
        return false;
    }
    const record = time as TimeOfDay;
    return (
        Number.isFinite(record.hour) &&
        Number.isFinite(record.minute) &&
        Number.isFinite(record.second) &&
        Number.isFinite(record.millisecond)
    );
}

/**
 * @param milliseconds - A length in `[0, 86400000)`.
 * @returns The time of day.
 */
function timeFromMilliseconds(milliseconds: number): TimeOfDay {
    const hour = Math.floor(milliseconds / 3_600_000);
    const minute = Math.floor((milliseconds % 3_600_000) / 60_000);
    const second = Math.floor((milliseconds % 60_000) / 1_000);
    const millisecond = milliseconds % 1_000;
    return { hour, minute, second, millisecond };
}
