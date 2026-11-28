import { readDuration } from "../utils/duration.utils.js";
import { formatClockText } from "../utils/duration-text.utils.js";
import type { FormatDurationAsClockParams } from "./format-duration-as-clock.types.js";

/**
 * Formats a duration as `H:mm:ss` for a timer.
 *
 * Hours are padded to two digits. Hours beyond 99 print in full. A
 * negative duration has a leading `-`.
 *
 * @param params - `duration` is required. `alwaysShowHours` defaults to `true`.
 * @returns The clock text, or `undefined` when `duration` is not usable.
 * @example
 * formatDurationAsClock({ duration: { hours: 1, minutes: 2, seconds: 3 } }); // "01:02:03"
 */
export function formatDurationAsClock({
    duration,
    alwaysShowHours = true,
    showMilliseconds = false,
}: FormatDurationAsClockParams): string | undefined {
    const value =
        typeof duration === "number"
            ? Number.isFinite(duration)
                ? duration
                : undefined
            : readDuration(duration);
    if (value === undefined) {
        return undefined;
    }
    return formatClockText(value, alwaysShowHours, showMilliseconds);
}
