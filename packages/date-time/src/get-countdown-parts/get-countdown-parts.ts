import type { DateInput } from "../types/date-input.types.js";
import type { CountdownParts } from "../types/relative-time.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { CountdownOptions } from "./get-countdown-parts.types.js";

const unitMilliseconds = {
    day: 86_400_000,
    hour: 3_600_000,
    minute: 60_000,
    second: 1_000,
} as const;

const unitOrder = ["day", "hour", "minute", "second"] as const;

/**
 * Splits the time remaining until a target into countdown fields.
 *
 * Every field is zero and `isComplete` is `true` once the target is not
 * after `now`. The parts are never negative. Days are exact 24-hour
 * stretches because a countdown has no time zone.
 *
 * @param target - The instant being counted down to.
 * @param options - `largestUnit` defaults to `"day"`.
 * @returns The remaining parts and the total milliseconds.
 * @throws {@link TypeError} When `target` has the wrong type.
 * @throws {@link RangeError} When `target` is not a real date.
 * @example
 * getCountdownParts("2026-01-01T01:00:00Z", { now: "2026-01-01T00:00:00Z", largestUnit: "hour" }).hours; // 1
 */
export function getCountdownParts(
    target: DateInput,
    options?: CountdownOptions,
): CountdownParts {
    const largestUnit = options?.largestUnit ?? "day";
    if (
        largestUnit !== "day" &&
        largestUnit !== "hour" &&
        largestUnit !== "minute" &&
        largestUnit !== "second"
    ) {
        throw rangeError(
            "largestUnit",
            `"day", "hour", "minute", or "second"`,
            largestUnit,
        );
    }
    const targetInstant = resolveDateInput(target, "target");
    const now = resolveNow(options?.now);
    const totalMilliseconds = targetInstant.getTime() - now.getTime();
    if (totalMilliseconds <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            totalMilliseconds: 0,
            isComplete: true,
        };
    }
    let remaining = totalMilliseconds;
    const parts = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    };
    const startIndex = unitOrder.indexOf(largestUnit);
    for (const unit of unitOrder.slice(startIndex)) {
        const size = unitMilliseconds[unit];
        const count = Math.floor(remaining / size);
        parts[`${unit}s` as "days" | "hours" | "minutes" | "seconds"] = count;
        remaining -= count * size;
    }
    parts.milliseconds = remaining;
    return {
        ...parts,
        totalMilliseconds,
        isComplete: false,
    };
}
