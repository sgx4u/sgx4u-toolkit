import type { Duration } from "../types/duration.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { durationToMilliseconds } from "../duration-to-milliseconds/duration-to-milliseconds.js";
import { millisecondsToDuration } from "../milliseconds-to-duration/milliseconds-to-duration.js";
import { assertDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { RoundDurationOptions } from "./round-duration.types.js";

const unitMilliseconds: Readonly<Record<string, number>> = {
    week: 7 * 86_400_000,
    day: 86_400_000,
    hour: 3_600_000,
    minute: 60_000,
    second: 1_000,
    millisecond: 1,
};

/**
 * Rounds a duration to a unit.
 *
 * Clock units and weeks use fixed lengths. Months and years use the length
 * of one unit starting at `relativeTo`.
 *
 * @param duration - The duration to round.
 * @param options - `smallestUnit` is required. `mode` defaults to `"nearest"`.
 * @returns A new duration in whole units of `smallestUnit`.
 * @throws {@link RangeError} When a calendar unit has no `relativeTo`.
 * @example
 * roundDuration({ minutes: 90 }, { smallestUnit: "hour" }); // { hours: 2 }
 */
export function roundDuration(
    duration: Duration,
    options: RoundDurationOptions,
): Duration {
    const checked = assertDuration(duration, "duration");
    const unit = assertTimeUnit(options?.smallestUnit, "smallestUnit");
    const mode = options.mode ?? "nearest";
    if (mode !== "nearest" && mode !== "down" && mode !== "up") {
        throw rangeError("mode", `"nearest", "down", or "up"`, mode);
    }
    const length = durationToMilliseconds(checked, {
        ...(options.timeZone !== undefined
            ? { timeZone: options.timeZone }
            : {}),
        ...(options.relativeTo !== undefined
            ? { relativeTo: options.relativeTo }
            : {}),
    });
    const size = lengthOfOneUnit(unit, options);
    const rounded = roundToSize(length, size, mode);
    const count = rounded / size;
    if (count === 0) {
        return {};
    }
    if (unit === "year") {
        return { years: count };
    }
    if (unit === "month") {
        return { months: count };
    }
    if (unit === "quarter") {
        return { months: count * 3 };
    }
    return millisecondsToDuration(rounded, {
        largestUnit: unit === "week" ? "week" : unit,
        smallestUnit: unit === "week" || unit === "day" ? "millisecond" : unit,
    });
}

/**
 * @param unit - The unit being rounded to.
 * @param options - Supplies `relativeTo` for calendar units.
 * @returns The millisecond length of one unit.
 */
function lengthOfOneUnit(
    unit: TimeUnit,
    options: RoundDurationOptions,
): number {
    const fixed = unitMilliseconds[unit];
    if (fixed !== undefined) {
        return fixed;
    }
    if (options.relativeTo === undefined) {
        throw rangeError(
            "smallestUnit",
            "a clock unit, or pass `relativeTo` for a calendar unit",
            unit,
        );
    }
    const sample: Duration =
        unit === "year"
            ? { years: 1 }
            : unit === "quarter"
              ? { months: 3 }
              : { months: 1 };
    return Math.abs(
        durationToMilliseconds(sample, {
            relativeTo: options.relativeTo,
            ...(options.timeZone !== undefined
                ? { timeZone: options.timeZone }
                : {}),
        }),
    );
}

/**
 * @param value - The signed length.
 * @param size - The positive unit length.
 * @param mode - How a fraction is resolved.
 * @returns The rounded length.
 */
function roundToSize(
    value: number,
    size: number,
    mode: "nearest" | "down" | "up",
): number {
    const sign = value < 0 ? -1 : 1;
    const quotient = Math.abs(value) / size;
    const whole =
        mode === "down"
            ? Math.floor(quotient)
            : mode === "up"
              ? Math.ceil(quotient)
              : Math.round(quotient);
    return sign * whole * size;
}
