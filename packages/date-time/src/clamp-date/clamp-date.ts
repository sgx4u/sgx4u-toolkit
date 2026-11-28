import { readDateInput } from "../utils/date-input.utils.js";
import type { ClampDateParams } from "./clamp-date.types.js";

/**
 * Limits a date to an inclusive range.
 *
 * @param params - `date`, inclusive `start`, and inclusive `end`.
 * @returns A new `Date` inside the range, or `undefined` when any value is not a real date. The inputs are not mutated.
 * @throws {@link RangeError} When `start` is after `end`.
 * @example
 * clampDate({
 *   date: "2024-01-10T00:00:00Z",
 *   start: "2024-01-01T00:00:00Z",
 *   end: "2024-01-05T00:00:00Z",
 * })?.toISOString(); // "2024-01-05T00:00:00.000Z"
 */
export function clampDate({
    date,
    start,
    end,
}: ClampDateParams): Date | undefined {
    const instant = readDateInput(date);
    const startDate = readDateInput(start);
    const endDate = readDateInput(end);
    if (
        instant === undefined ||
        startDate === undefined ||
        endDate === undefined
    ) {
        return undefined;
    }
    if (startDate.getTime() > endDate.getTime()) {
        throw new RangeError(
            "`start` must be at or before `end`; received a start after the end.",
        );
    }
    if (instant.getTime() < startDate.getTime()) {
        return startDate;
    }
    if (instant.getTime() > endDate.getTime()) {
        return endDate;
    }
    return instant;
}
