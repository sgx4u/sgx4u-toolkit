import type { DateInput } from "../types/date-input.types.js";
import type { Interval } from "../types/interval.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { readInterval } from "../utils/interval.utils.js";

/**
 * Reports whether a date is inside a half-open interval.
 *
 * The start is included and the end is excluded.
 *
 * @param date - The date to test.
 * @param interval - The interval.
 * @returns `true` when `start <= date < end`.
 * @throws {@link RangeError} When the interval is invalid.
 * @example
 * isWithinInterval("2026-01-01T12:00:00Z", { start: new Date("2026-01-01T00:00:00Z"), end: new Date("2026-01-02T00:00:00Z") }); // true
 */
export function isWithinInterval(date: DateInput, interval: Interval): boolean {
    const checked = readInterval(interval);
    const instant = resolveDateInput(date, "date").getTime();
    return (
        instant >= checked.start.getTime() && instant < checked.end.getTime()
    );
}
