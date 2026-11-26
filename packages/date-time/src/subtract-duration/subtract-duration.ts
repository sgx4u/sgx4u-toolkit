import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type {
    DisambiguationOptions,
    Overflow,
    TimeZoneOptions,
} from "../types/options.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import { readDuration, negatedDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";

/**
 * Options for {@link subtractDuration}.
 */
export interface SubtractDurationOptions
    extends TimeZoneOptions, DisambiguationOptions {
    /**
     * What to do when the day does not exist in the target month.
     *
     * @defaultValue `"constrain"`
     */
    overflow?: Overflow;
}

/**
 * Fields for {@link subtractDuration}.
 */
export interface SubtractDurationParams extends SubtractDurationOptions {
    /**
     * The starting instant.
     */
    date: DateInput;
    /**
     * The length to subtract.
     */
    duration: Duration;
}

/**
 * Subtracts a duration from a date.
 *
 * This is `addDuration` with every field negated. The same overflow and
 * daylight-saving rules apply.
 *
 * @param params - `date` and `duration` are required. `timeZone` defaults to the system zone, `disambiguation` to `"compatible"`, and `overflow` to `"constrain"`.
 * @returns A new `Date`, or `undefined` when `date` or `duration` is not usable.
 * @throws {@link RangeError} When `timeZone` is not a usable zone, `disambiguation` or `overflow` is not a known mode, the day does not exist and `overflow` is `"reject"`, or `"reject"` hits a gap or overlap.
 * @example
 * subtractDuration({ date: "2026-03-31T00:00:00Z", duration: { months: 1 }, timeZone: "UTC" })?.toISOString(); // "2026-02-28T00:00:00.000Z"
 */
export function subtractDuration({
    date,
    duration,
    timeZone,
    disambiguation,
    overflow = "constrain",
}: SubtractDurationParams): Date | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    if (overflow !== "constrain" && overflow !== "reject") {
        throw rangeError("overflow", `"constrain" or "reject"`, overflow);
    }
    return addDuration({
        date,
        duration: negatedDuration(checked),
        ...(timeZone !== undefined ? { timeZone } : {}),
        ...(disambiguation !== undefined ? { disambiguation } : {}),
        overflow,
    });
}
