import { rangeError } from "../utils/error.utils.js";
import type { FormatUTCOffsetParams } from "./format-utc-offset.types.js";

/**
 * Formats a UTC offset in minutes.
 *
 * Zero is `+00:00` unless `useZForZero` is true. `short` writes `+5:30`,
 * and `+5` when the minutes are zero.
 *
 * @param params - `offsetMinutes` is required. `style` defaults to `"extended"`.
 * @returns The offset text, or `undefined` when `offsetMinutes` is not a finite number.
 * @throws {@link RangeError} When `style` is not one of the three styles.
 * @example
 * formatUTCOffset({ offsetMinutes: 330 }); // "+05:30"
 */
export function formatUTCOffset({
    offsetMinutes,
    style = "extended",
    useZForZero,
}: FormatUTCOffsetParams): string | undefined {
    if (typeof offsetMinutes !== "number" || !Number.isFinite(offsetMinutes)) {
        return undefined;
    }
    if (style !== "extended" && style !== "basic" && style !== "short") {
        throw rangeError("style", `"extended", "basic", or "short"`, style);
    }
    if (offsetMinutes === 0 && useZForZero === true) {
        return "Z";
    }
    const sign = offsetMinutes < 0 ? "-" : "+";
    const absolute = Math.abs(offsetMinutes);
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
