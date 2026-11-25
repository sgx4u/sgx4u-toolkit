import type { Duration } from "../types/duration.types.js";
import type { Interval } from "../types/interval.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import {
    assertDuration,
    clockMilliseconds,
    hasCalendarUnits,
} from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readInterval } from "../utils/interval.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

const maximumPieceCount = 100_000;

/**
 * Splits an interval into consecutive pieces of `step`.
 *
 * The last piece is shorter when the interval does not divide evenly.
 * `{ months: 1 }` steps by calendar months in the zone.
 *
 * @param interval - The half-open interval to split.
 * @param step - A positive duration.
 * @param options - `timeZone` defaults to the system zone.
 * @returns The pieces, oldest first. An empty interval returns `[]`.
 * @throws {@link RangeError} When `step` is zero or negative, or the result would exceed 100000 pieces.
 * @example
 * splitInterval({ start: new Date(0), end: new Date(10) }, { milliseconds: 4 }).length; // 3
 */
export function splitInterval(
    interval: Interval,
    step: Duration,
    options?: TimeZoneOptions,
): Interval[] {
    const checked = readInterval(interval);
    const duration = assertDuration(step, "step");
    if (!isPositiveStep(duration)) {
        throw rangeError("step", "a positive duration", step);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const pieces: Interval[] = [];
    let cursor = checked.start.getTime();
    const end = checked.end.getTime();
    while (cursor < end) {
        const next = addDuration(new Date(cursor), duration, {
            timeZone,
        }).getTime();
        if (next <= cursor) {
            throw rangeError(
                "step",
                "a duration that moves time forward",
                step,
            );
        }
        pieces.push({
            start: new Date(cursor),
            end: new Date(Math.min(next, end)),
        });
        if (pieces.length > maximumPieceCount) {
            throw rangeError("interval", "at most 100000 pieces", interval);
        }
        cursor = next;
    }
    return pieces;
}

/**
 * @param duration - A checked duration.
 * @returns `true` when the duration moves time forward.
 */
function isPositiveStep(duration: Duration): boolean {
    if (hasCalendarUnits(duration)) {
        return (
            (duration.years ?? 0) > 0 ||
            (duration.months ?? 0) > 0 ||
            (duration.weeks ?? 0) > 0 ||
            (duration.days ?? 0) > 0
        );
    }
    return clockMilliseconds(duration) > 0;
}
