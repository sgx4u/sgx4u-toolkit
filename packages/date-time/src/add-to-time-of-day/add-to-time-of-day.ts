import type { Duration } from "../types/duration.types.js";
import type { TimeOfDay } from "../types/time.types.js";
import { assertDuration, clockMilliseconds } from "../utils/duration.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";

const millisecondsPerDay = 86_400_000;

/**
 * Adds a duration to a time of day, wrapping past midnight.
 *
 * Months and years are rejected because a time of day has no calendar date.
 * Weeks and days become part of `dayOffset`.
 *
 * @param time - The starting time.
 * @param duration - The length to add. Clock fields may be fractional in the smallest unit.
 * @returns The wrapped time and how many calendar days were crossed. Negative durations cross backward.
 * @throws {@link RangeError} When the duration contains months or years.
 * @example
 * addToTimeOfDay({ hour: 23, minute: 30, second: 0, millisecond: 0 }, { hours: 2 }); // { time: { hour: 1, minute: 30, second: 0, millisecond: 0 }, dayOffset: 1 }
 */
export function addToTimeOfDay(
    time: TimeOfDay,
    duration: Duration,
): { time: TimeOfDay; dayOffset: number } {
    if (
        typeof time !== "object" ||
        time === null ||
        !Number.isFinite(time.hour) ||
        !Number.isFinite(time.minute)
    ) {
        throw typeError("time", "a time of day", time);
    }
    const checked = assertDuration(duration, "duration");
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
