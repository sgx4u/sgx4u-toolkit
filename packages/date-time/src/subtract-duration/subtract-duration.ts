import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import type { AddDurationOptions } from "../add-duration/add-duration.types.js";
import { assertDuration, negatedDuration } from "../utils/duration.utils.js";

/**
 * Subtracts a duration from a date.
 *
 * This is `addDuration` with every field negated. The same overflow and
 * daylight-saving rules apply.
 *
 * @param date - The starting instant.
 * @param duration - The length to subtract.
 * @param options - The same options as `addDuration`.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `date` or `duration` has the wrong type.
 * @throws {@link RangeError} When a value is invalid or a `"reject"` option hits a missing time.
 * @example
 * subtractDuration("2026-03-31T00:00:00Z", { months: 1 }, { timeZone: "UTC" }).toISOString(); // "2026-02-28T00:00:00.000Z"
 */
export function subtractDuration(
    date: DateInput,
    duration: Duration,
    options?: AddDurationOptions,
): Date {
    return addDuration(
        date,
        negatedDuration(assertDuration(duration, "duration")),
        options,
    );
}
