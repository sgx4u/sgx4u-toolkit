import type { Duration } from "../types/duration.types.js";
import { assertDuration, durationFieldNames } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { isTimeUnit } from "../utils/unit.utils.js";
import type { NormalizeDurationOptions } from "./normalize-duration.types.js";

const carryInto: Readonly<
    Record<string, { unit: keyof Duration; size: number }>
> = {
    milliseconds: { unit: "seconds", size: 1_000 },
    seconds: { unit: "minutes", size: 60 },
    minutes: { unit: "hours", size: 60 },
    hours: { unit: "days", size: 24 },
};

const rank: Readonly<Record<string, number>> = {
    year: 0,
    quarter: 1,
    month: 2,
    week: 3,
    day: 4,
    hour: 5,
    minute: 6,
    second: 7,
    millisecond: 8,
};

/**
 * Balances a duration so smaller units do not overflow.
 *
 * Without `relativeTo`, a day is 24 hours and the function does not convert
 * to or from months or years. `90` minutes becomes `1` hour and `30` minutes.
 *
 * @param duration - The duration to balance.
 * @param options - `largestUnit` defaults to `"day"`.
 * @returns A new duration. Zero fields are omitted.
 * @throws {@link RangeError} When `duration` or `largestUnit` is invalid.
 * @example
 * normalizeDuration({ minutes: 90 }); // { hours: 1, minutes: 30 }
 */
export function normalizeDuration(
    duration: Duration,
    options?: NormalizeDurationOptions,
): Duration {
    const checked = assertDuration(duration, "duration");
    const largestUnit = options?.largestUnit ?? "day";
    if (!isTimeUnit(largestUnit)) {
        throw rangeError("largestUnit", "a time unit", largestUnit);
    }
    const balanced: Record<string, number> = {};
    for (const fieldName of durationFieldNames) {
        balanced[fieldName] = checked[fieldName] ?? 0;
    }
    const largestRank = rank[largestUnit] ?? 4;
    const steps = ["milliseconds", "seconds", "minutes", "hours"] as const;
    for (const fieldName of steps) {
        const carry = carryInto[fieldName];
        if (carry === undefined) {
            continue;
        }
        const targetRank =
            rank[
                carry.unit === "days" ? "day" : carry.unit.replace(/s$/, "")
            ] ?? 0;
        if (targetRank < largestRank) {
            continue;
        }
        const value = balanced[fieldName] ?? 0;
        const whole = Math.trunc(value / carry.size);
        balanced[fieldName] = value - whole * carry.size;
        balanced[carry.unit] = (balanced[carry.unit] ?? 0) + whole;
    }
    const result: Duration = {};
    for (const fieldName of durationFieldNames) {
        const value = balanced[fieldName] ?? 0;
        if (value !== 0) {
            result[fieldName] = value;
        }
    }
    return result;
}
