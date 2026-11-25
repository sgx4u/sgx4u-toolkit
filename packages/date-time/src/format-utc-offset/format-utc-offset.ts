import { assertFiniteNumber } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { FormatUtcOffsetOptions } from "./format-utc-offset.types.js";

/**
 * Formats a UTC offset in minutes.
 *
 * Zero is `+00:00` unless `useZForZero` is true. `short` writes `+5:30`,
 * and `+5` when the minutes are zero.
 *
 * @param offsetMinutes - Minutes east of UTC. A fraction is kept in the minutes.
 * @param options - `style` defaults to `"extended"`.
 * @returns The offset text.
 * @throws {@link TypeError} When `offsetMinutes` is not a number.
 * @throws {@link RangeError} When `style` is not one of the three styles.
 * @example
 * formatUtcOffset(330); // "+05:30"
 */
export function formatUtcOffset(
    offsetMinutes: number,
    options?: FormatUtcOffsetOptions,
): string {
    const minutes = assertFiniteNumber(offsetMinutes, "offsetMinutes");
    const style = options?.style ?? "extended";
    if (style !== "extended" && style !== "basic" && style !== "short") {
        throw rangeError("style", `"extended", "basic", or "short"`, style);
    }
    if (minutes === 0 && options?.useZForZero === true) {
        return "Z";
    }
    const sign = minutes < 0 ? "-" : "+";
    const absolute = Math.abs(minutes);
    const wholeHours = Math.floor(absolute / 60);
    const minutePart = absolute - wholeHours * 60;
    const roundedMinutes = Math.round(minutePart);
    if (style === "short") {
        if (roundedMinutes === 0) {
            return `${sign}${String(wholeHours)}`;
        }
        return `${sign}${String(wholeHours)}:${String(roundedMinutes).padStart(2, "0")}`;
    }
    const hourText = String(wholeHours).padStart(2, "0");
    const minuteText = String(roundedMinutes).padStart(2, "0");
    if (style === "basic") {
        return `${sign}${hourText}${minuteText}`;
    }
    return `${sign}${hourText}:${minuteText}`;
}
