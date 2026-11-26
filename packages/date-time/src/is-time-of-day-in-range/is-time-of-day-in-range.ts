import type { TimeOfDay } from "../types/time.types.js";
import { compareTimesOfDay } from "../compare-times-of-day/compare-times-of-day.js";
import { parseTimeOfDay } from "../parse-time-of-day/parse-time-of-day.js";
import { typeError } from "../utils/error.utils.js";
import type { IsTimeOfDayInRangeParams } from "./is-time-of-day-in-range.types.js";

/**
 * Reports whether a time falls in a daily range.
 *
 * A range whose end is not after its start continues past midnight.
 * `22:00`–`06:00` contains `23:00` and `05:00`. The end is excluded
 * unless `includeEnd` is true.
 *
 * @param params - `time` and `range` are required. `includeEnd` defaults to `false`.
 * @returns `true` when `time` is inside the range.
 * @throws {@link TypeError} When a bound cannot be read.
 * @example
 * isTimeOfDayInRange({
 *   time: { hour: 23, minute: 0, second: 0, millisecond: 0 },
 *   range: { start: "22:00", end: "06:00" },
 * }); // true
 */
export function isTimeOfDayInRange({
    time,
    range,
    includeEnd = false,
}: IsTimeOfDayInRangeParams): boolean {
    const start = readBound(range.start, "range.start");
    const end = readBound(range.end, "range.end");
    const afterStart = compareTimesOfDay(time, start) >= 0;
    const beforeEnd = includeEnd
        ? compareTimesOfDay(time, end) <= 0
        : compareTimesOfDay(time, end) < 0;
    if (compareTimesOfDay(end, start) > 0) {
        return afterStart && beforeEnd;
    }
    return afterStart || beforeEnd;
}

/**
 * @param bound - A time string or a time of day.
 * @param argumentName - The parameter name used in an error.
 * @returns The time of day.
 * @throws {@link TypeError} When the bound cannot be read.
 */
function readBound(bound: TimeOfDay | string, argumentName: string): TimeOfDay {
    if (typeof bound === "string") {
        const parsed = parseTimeOfDay(bound);
        if (parsed === undefined) {
            throw typeError(argumentName, "a time of day", bound);
        }
        return parsed;
    }
    return bound;
}