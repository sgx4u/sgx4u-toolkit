import { parseTimeOfDay } from "../parse-time-of-day/parse-time-of-day.js";
import type { TimeOfDay, TimeRange, Weekday } from "../types/time.types.js";
import { assertIntegerInRange } from "./assert.utils.js";
import { rangeError, typeError } from "./error.utils.js";

/**
 * Guards the business-day list.
 *
 * @param workingDays - ISO weekdays that are open.
 * @returns The same days.
 * @throws {@link TypeError} When `workingDays` is not an array.
 * @throws {@link RangeError} When a day is outside 1 through 7.
 */
export function assertWorkingDays(
    workingDays: readonly Weekday[],
): readonly Weekday[] {
    if (!Array.isArray(workingDays)) {
        throw typeError("workingDays", "an array of ISO weekdays", workingDays);
    }
    for (const [index, day] of workingDays.entries()) {
        assertIntegerInRange(day, `workingDays[${String(index)}]`, 1, 7);
    }
    return workingDays;
}

/**
 * Guards working windows.
 *
 * @param businessHours - Daily windows. An empty list means the whole day.
 * @returns The same windows.
 * @throws {@link TypeError} When `businessHours` is not an array.
 * @throws {@link RangeError} When a bound is not a time of day.
 */
export function assertBusinessHours(
    businessHours: readonly TimeRange[],
): readonly TimeRange[] {
    if (!Array.isArray(businessHours)) {
        throw typeError(
            "businessHours",
            "an array of time ranges",
            businessHours,
        );
    }
    for (const range of businessHours) {
        if (
            readBound(range?.start) === undefined ||
            readBound(range?.end) === undefined
        ) {
            throw rangeError("businessHours", "ranges of HH:mm", range);
        }
    }
    return businessHours;
}

/**
 * @param bound - A time string or a time of day.
 * @returns The parsed time, or `undefined` when the bound is missing or not a time.
 */
function readBound(
    bound: string | TimeOfDay | undefined,
): TimeOfDay | undefined {
    if (typeof bound === "string") {
        return parseTimeOfDay(bound);
    }
    if (bound === undefined) {
        return undefined;
    }
    return parseTimeOfDay(formatBound(bound));
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
