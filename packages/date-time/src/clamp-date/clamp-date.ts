import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";

/**
 * Limits a date to an inclusive range.
 *
 * @param date - The date to limit.
 * @param bounds - Inclusive `start` and `end`.
 * @returns A new `Date` inside the range. The inputs are not mutated.
 * @throws {@link TypeError} When a value has the wrong type.
 * @throws {@link RangeError} When a value is not a real date, or `start` is after `end`.
 * @example
 * clampDate("2024-01-10T00:00:00Z", { start: "2024-01-01T00:00:00Z", end: "2024-01-05T00:00:00Z" }).toISOString(); // "2024-01-05T00:00:00.000Z"
 */
export function clampDate(
    date: DateInput,
    bounds: { start: DateInput; end: DateInput },
): Date {
    if (bounds === null || typeof bounds !== "object") {
        throw typeError("bounds", "an object with start and end", bounds);
    }
    const instant = resolveDateInput(date, "date");
    const start = resolveDateInput(bounds.start, "bounds.start");
    const end = resolveDateInput(bounds.end, "bounds.end");
    if (start.getTime() > end.getTime()) {
        throw new RangeError(
            "`bounds.start` must be at or before `bounds.end`; received a start after the end.",
        );
    }
    if (instant.getTime() < start.getTime()) {
        return start;
    }
    if (instant.getTime() > end.getTime()) {
        return end;
    }
    return instant;
}
