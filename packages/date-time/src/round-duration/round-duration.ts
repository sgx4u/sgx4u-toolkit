import type { Duration } from "../types/duration.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { durationToMilliseconds } from "../duration-to-milliseconds/duration-to-milliseconds.js";
import { millisecondsToDuration } from "../milliseconds-to-duration/milliseconds-to-duration.js";
import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { RoundDurationParams } from "./round-duration.types.js";

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
 * @param params - `duration` and `smallestUnit` are required. `mode` defaults to `"nearest"`.
 * @returns A new duration in whole units of `smallestUnit`, or `undefined` when `duration` is not usable.
 * @throws {@link RangeError} When a calendar unit has no `relativeTo`, `mode` is unknown, or `smallestUnit` is unknown.
 * @example
 * roundDuration({ duration: { minutes: 90 }, smallestUnit: "hour" }); // { hours: 2 }
 */
export function roundDuration({
    duration,
    smallestUnit: smallestUnitInput,
    mode = "nearest",
    timeZone,
    relativeTo,
}: RoundDurationParams): Duration | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    const unit = assertTimeUnit(smallestUnitInput, "smallestUnit");
    if (mode !== "nearest" && mode !== "down" && mode !== "up") {
        throw rangeError("mode", `"nearest", "down", or "up"`, mode);
    }
    const length = durationToMilliseconds(checked, {
        ...(timeZone !== undefined ? { timeZone } : {}),
        ...(relativeTo !== undefined ? { relativeTo } : {}),
    });
    const size = lengthOfOneUnit(unit, {
        ...(timeZone !== undefined ? { timeZone } : {}),
        ...(relativeTo !== undefined ? { relativeTo } : {}),
    });
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
    return (
        millisecondsToDuration({
            milliseconds: rounded,
            largestUnit: unit === "week" ? "week" : unit,
            smallestUnit:
                unit === "week" || unit === "day" ? "millisecond" : unit,
        }) ?? {}
    );
}

/**
 * @param unit - The unit being rounded to.
 * @param params - Supplies `relativeTo` for calendar units.
 * @returns The millisecond length of one unit.
 */
function lengthOfOneUnit(
    unit: TimeUnit,
    params: Pick<RoundDurationParams, "relativeTo" | "timeZone">,
): number {
    const fixed = unitMilliseconds[unit];
    if (fixed !== undefined) {
        return fixed;
    }
    if (params.relativeTo === undefined) {
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
            relativeTo: params.relativeTo,
            ...(params.timeZone !== undefined
                ? { timeZone: params.timeZone }
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