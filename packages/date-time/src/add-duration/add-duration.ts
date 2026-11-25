import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import { addDurationToInstant } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { assertDuration } from "../utils/duration.utils.js";
import {
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { AddDurationOptions } from "./add-duration.types.js";
import { rangeError } from "../utils/error.utils.js";

/**
 * Adds a duration to a date.
 *
 * Years and months move the wall clock together, then weeks and days.
 * January 31 plus one month is February 28 or 29. Hours and smaller units
 * are elapsed time, so 24 hours and one day differ across a daylight-saving
 * change. The input date is not mutated.
 *
 * @param date - The starting instant.
 * @param duration - The length to add. Every field must share one sign.
 * @param options - `timeZone` defaults to the system zone, `disambiguation` to `"compatible"`, and `overflow` to `"constrain"`.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `date` or `duration` has the wrong type.
 * @throws {@link RangeError} When a value is invalid, the day does not exist and `overflow` is `"reject"`, or `"reject"` hits a gap or overlap.
 * @example
 * addDuration("2026-01-31T00:00:00Z", { months: 1 }, { timeZone: "UTC" }).toISOString(); // "2026-02-28T00:00:00.000Z"
 */
export function addDuration(
    date: DateInput,
    duration: Duration,
    options?: AddDurationOptions,
): Date {
    const checked = assertDuration(duration, "duration");
    const overflow = options?.overflow ?? "constrain";
    if (overflow !== "constrain" && overflow !== "reject") {
        throw rangeError("overflow", `"constrain" or "reject"`, overflow);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    return new Date(
        addDurationToInstant(
            resolveDateInput(date, "date", timeZone).getTime(),
            checked,
            timeZone,
            resolveDisambiguation(options?.disambiguation),
            overflow,
        ),
    );
}
