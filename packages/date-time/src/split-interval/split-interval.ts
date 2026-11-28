import type { Duration } from "../types/duration.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Interval } from "../types/interval.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import {
    clockMilliseconds,
    hasCalendarUnits,
    readDuration,
} from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readInterval } from "../utils/interval.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

const maximumPieceCount = 100_000;

/**
 * Fields for {@link splitInterval}.
 */
export interface SplitIntervalParams extends TimeZoneOptions {
    /**
     * The inclusive start of the half-open interval to split.
     */
    start: DateInput;
    /**
     * The exclusive end of the half-open interval to split.
     */
    end: DateInput;
    /**
     * A positive duration for each piece except the last.
     */
    step: Duration;
}

/**
 * Splits an interval into consecutive pieces of `step`.
 *
 * The last piece is shorter when the interval does not divide evenly.
 * `{ months: 1 }` steps by calendar months in the zone.
 *
 * @param params - `start`, `end`, and `step` are required. `timeZone` defaults to the system zone.
 * @returns The pieces, oldest first. An empty interval returns `[]`, or `undefined` when `step` is not usable or a step does not advance time.
 * @throws {@link RangeError} When `step` is zero or negative, or the result would exceed 100000 pieces.
 * @example
 * splitInterval({ start: new Date(0), end: new Date(10), step: { milliseconds: 4 } })?.length; // 3
 */
export function splitInterval({
    start,
    end,
    step: stepInput,
    timeZone,
}: SplitIntervalParams): Interval[] | undefined {
    const checked = readInterval({ start, end });
    const duration = readDuration(stepInput);
    if (duration === undefined) {
        return undefined;
    }
    if (!isPositiveStep(duration)) {
        throw rangeError("step", "a positive duration", stepInput);
    }
    const zone = resolveTimeZone(timeZone);
    const pieces: Interval[] = [];
    let cursor = checked.start.getTime();
    const intervalEnd = checked.end.getTime();
    while (cursor < intervalEnd) {
        const nextDate = addDuration({
            date: new Date(cursor),
            duration,
            timeZone: zone,
        });
        if (nextDate === undefined) {
            return undefined;
        }
        const next = nextDate.getTime();
        if (next <= cursor) {
            throw rangeError(
                "step",
                "a duration that moves time forward",
                stepInput,
            );
        }
        pieces.push({
            start: new Date(cursor),
            end: new Date(Math.min(next, intervalEnd)),
        });
        if (pieces.length > maximumPieceCount) {
            throw rangeError("interval", "at most 100000 pieces", {
                start,
                end,
            });
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
