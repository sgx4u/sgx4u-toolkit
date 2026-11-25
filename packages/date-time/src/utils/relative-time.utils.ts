import type { TimeUnit } from "../types/time.types.js";
import { differenceInInstantUnit } from "./arithmetic.utils.js";

/**
 * A signed relative-time value. Negative means the past.
 */
export interface ChosenRelativeTime {
    value: number;
    unit: TimeUnit;
}

/**
 * Chooses a relative-time unit from the elapsed time.
 *
 * Under 45 seconds uses seconds, under 45 minutes uses minutes, under 22
 * hours uses hours, under 26 days uses days, under 11 calendar months uses
 * months, and otherwise years. Weeks are never chosen. The value is
 * rounded half away from zero.
 *
 * @param laterEpoch - The date being described.
 * @param earlierEpoch - The reference instant, usually now.
 * @param timeZone - Zone used for the month and year counts.
 * @param unit - `"auto"` or a fixed unit.
 * @returns The signed value and the unit.
 */
export function chooseRelativeTime(
    laterEpoch: number,
    earlierEpoch: number,
    timeZone: string,
    unit: TimeUnit | "auto",
): ChosenRelativeTime {
    if (unit !== "auto") {
        return {
            value: differenceInInstantUnit(
                laterEpoch,
                earlierEpoch,
                unit,
                timeZone,
                "round",
            ),
            unit,
        };
    }
    const elapsed = laterEpoch - earlierEpoch;
    const absolute = Math.abs(elapsed);
    if (absolute < 45_000) {
        return { value: roundHalfAway(elapsed / 1_000), unit: "second" };
    }
    if (absolute < 45 * 60_000) {
        return { value: roundHalfAway(elapsed / 60_000), unit: "minute" };
    }
    if (absolute < 22 * 3_600_000) {
        return { value: roundHalfAway(elapsed / 3_600_000), unit: "hour" };
    }
    if (absolute < 26 * 86_400_000) {
        return { value: roundHalfAway(elapsed / 86_400_000), unit: "day" };
    }
    const months = differenceInInstantUnit(
        laterEpoch,
        earlierEpoch,
        "month",
        timeZone,
        "round",
    );
    if (Math.abs(months) < 11) {
        return { value: months, unit: "month" };
    }
    return {
        value: differenceInInstantUnit(
            laterEpoch,
            earlierEpoch,
            "year",
            timeZone,
            "round",
        ),
        unit: "year",
    };
}

/**
 * @param value - A signed number.
 * @returns The nearest integer, with a half moving away from zero.
 */
function roundHalfAway(value: number): number {
    const sign = Math.sign(value);
    const absolute = Math.abs(value);
    return sign * Math.round(absolute);
}
