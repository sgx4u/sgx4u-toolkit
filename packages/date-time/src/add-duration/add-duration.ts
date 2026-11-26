import { addDurationToInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import {
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { AddDurationParams } from "./add-duration.types.js";

/**
 * Adds a duration to a date.
 *
 * Years and months move the wall clock together, then weeks and days.
 * January 31 plus one month is February 28 or 29. Hours and smaller units
 * are elapsed time, so 24 hours and one day differ across a daylight-saving
 * change. The input date is not mutated.
 *
 * @param params - `date` is the starting instant and `duration` is the length to add. Every duration field must share one sign. `timeZone` defaults to the system zone, `disambiguation` to `"compatible"`, and `overflow` to `"constrain"`.
 * @returns A new `Date`, or `undefined` when `date` or `duration` is not usable.
 * @throws {@link RangeError} When `timeZone` is not a usable zone, `disambiguation` or `overflow` is not a known mode, the day does not exist and `overflow` is `"reject"`, or `"reject"` hits a gap or overlap.
 * @example
 * addDuration({ date: "2026-01-31T00:00:00Z", duration: { months: 1 }, timeZone: "UTC" })?.toISOString();
 */
export function addDuration({
    date,
    duration,
    timeZone,
    disambiguation,
    overflow = "constrain",
}: AddDurationParams): Date | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    if (overflow !== "constrain" && overflow !== "reject") {
        throw rangeError("overflow", `"constrain" or "reject"`, overflow);
    }
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    return new Date(
        addDurationToInstant(
            resolved.getTime(),
            checked,
            zone,
            resolveDisambiguation(disambiguation),
            overflow,
        ),
    );
}
