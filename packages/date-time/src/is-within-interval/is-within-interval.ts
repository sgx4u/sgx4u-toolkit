import type { DateInput } from "../types/date-input.types.js";
import type { Interval } from "../types/interval.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { isIntervalValue } from "../utils/interval.utils.js";

/**
 * Fields for {@link isWithinInterval}.
 */
export interface IsWithinIntervalParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * The half-open interval.
     */
    interval: Interval;
}

/**
 * Reports whether a date is inside a half-open interval.
 *
 * The start is included and the end is excluded.
 *
 * @param params - `date` and `interval` are required.
 * @returns `true` when `start <= date < end`.
 * @example
 * isWithinInterval({
 *   date: "2026-01-01T12:00:00Z",
 *   interval: {
 *     start: new Date("2026-01-01T00:00:00Z"),
 *     end: new Date("2026-01-02T00:00:00Z"),
 *   },
 * }); // true
 */
export function isWithinInterval({
    date,
    interval,
}: IsWithinIntervalParams): boolean {
    if (!isIntervalValue(interval)) {
        return false;
    }
    const instant = readDateInput(date);
    if (instant === undefined) {
        return false;
    }
    const instantTime = instant.getTime();
    return (
        instantTime >= interval.start.getTime() &&
        instantTime < interval.end.getTime()
    );
}
