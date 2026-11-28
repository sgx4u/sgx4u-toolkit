import { addDuration } from "../add-duration/add-duration.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { CompareDurationsParams } from "./compare-durations.types.js";

/**
 * Compares two durations by their length.
 *
 * Months and years need `relativeTo`, because their length depends on the
 * calendar.
 *
 * @param params - `first`, `second`, and optional `relativeTo` and `timeZone`.
 * @returns `-1`, `0`, or `1`, or `undefined` when either duration or `relativeTo` is not usable.
 * @throws {@link RangeError} When a calendar unit has no `relativeTo`, or `timeZone` is unusable.
 * @example
 * compareDurations({
 *   first: { hours: 2 },
 *   second: { minutes: 90 },
 * }); // 1
 */
export function compareDurations({
    first,
    second,
    relativeTo,
    timeZone,
}: CompareDurationsParams): -1 | 0 | 1 | undefined {
    const left = durationMilliseconds(first, relativeTo, timeZone);
    const right = durationMilliseconds(second, relativeTo, timeZone);
    if (left === undefined || right === undefined) {
        return undefined;
    }
    if (left < right) {
        return -1;
    }
    if (left > right) {
        return 1;
    }
    return 0;
}

/**
 * @param duration - A duration to measure.
 * @param relativeTo - Anchor for calendar units.
 * @param timeZone - Zone for `relativeTo` and `addDuration`.
 * @returns Signed milliseconds, or `undefined` when the duration is not usable.
 * @throws {@link RangeError} When months or years are present without `relativeTo`.
 */
function durationMilliseconds(
    duration: Duration,
    relativeTo: DateInput | undefined,
    timeZone: string | undefined,
): number | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    if (
        ((checked.years ?? 0) !== 0 || (checked.months ?? 0) !== 0) &&
        relativeTo === undefined
    ) {
        throw rangeError(
            "first",
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
