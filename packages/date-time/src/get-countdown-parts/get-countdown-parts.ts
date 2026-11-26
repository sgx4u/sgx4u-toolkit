import type { CountdownParts } from "../types/relative-time.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { GetCountdownPartsParams } from "./get-countdown-parts.types.js";

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
 * @param params - `target` is the instant being counted down to; `largestUnit` defaults to `"day"`.
 * @returns The remaining parts and the total milliseconds, or `undefined` when `target` or `now` is not usable.
 * @throws {@link RangeError} When `largestUnit` is unknown.
 * @example
 * getCountdownParts({ target: "2026-01-01T01:00:00Z", now: "2026-01-01T00:00:00Z", largestUnit: "hour" })?.hours; // 1
 */
export function getCountdownParts({
    target,
    now,
    largestUnit = "day",
}: GetCountdownPartsParams): CountdownParts | undefined {
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
    const targetInstant = readDateInput(target);
    const reference = readNow(now);
    if (targetInstant === undefined || reference === undefined) {
        return undefined;
    }
    const totalMilliseconds = targetInstant.getTime() - reference.getTime();
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

/**
 * @param now - An optional override for the current instant.
 * @returns The reference instant.
 */
function readNow(now: unknown): Date | undefined {
    if (now === undefined) {
        return new Date(Date.now());
    }
    return readDateInput(now);
}
