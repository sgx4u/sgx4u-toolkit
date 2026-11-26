import { addDuration } from "../add-duration/add-duration.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { DurationToMillisecondsParams } from "./duration-to-milliseconds.types.js";

/**
 * Returns the exact length of a duration in milliseconds.
 *
 * Without `relativeTo`, a day is 24 hours and a week is 7 days. Months or
 * years without `relativeTo` throw.
 *
 * @param params - `duration` is required. `relativeTo` is required for months or years.
 * @returns The signed length in milliseconds, or `undefined` when `duration` or `relativeTo` is not usable.
 * @throws {@link RangeError} When months or years are present without `relativeTo`, or `timeZone` is unusable.
 * @example
 * durationToMilliseconds({ duration: { hours: 1, minutes: 30 } }); // 5400000
 */
export function durationToMilliseconds({
    duration,
    relativeTo,
    timeZone,
}: DurationToMillisecondsParams): number | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    if (
        ((checked.years ?? 0) !== 0 || (checked.months ?? 0) !== 0) &&
        relativeTo === undefined
    ) {
        throw rangeError(
            "duration",
            "free of months and years, or pass `relativeTo`",
            duration,
        );
    }
    if (relativeTo !== undefined) {
        const zone = resolveTimeZone(timeZone);
        const start = readDateInput(relativeTo, zone);
        if (start === undefined) {
            return undefined;
        }
        const end = addDuration({
            date: start,
            duration: checked,
            timeZone: zone,
        });
        if (end === undefined) {
            return undefined;
        }
        return end.getTime() - start.getTime();
    }
    return (
        (checked.weeks ?? 0) * 7 * 86_400_000 +
        (checked.days ?? 0) * 86_400_000 +
        (checked.hours ?? 0) * 3_600_000 +
        (checked.minutes ?? 0) * 60_000 +
        (checked.seconds ?? 0) * 1_000 +
        (checked.milliseconds ?? 0)
    );
}
