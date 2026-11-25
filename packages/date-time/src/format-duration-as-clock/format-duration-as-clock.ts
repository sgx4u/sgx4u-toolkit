import type { Duration } from "../types/duration.types.js";
import { assertFiniteNumber } from "../utils/assert.utils.js";
import { assertDuration } from "../utils/duration.utils.js";
import { formatClockText } from "../utils/duration-text.utils.js";
import type { FormatDurationAsClockOptions } from "./format-duration-as-clock.types.js";

/**
 * Formats a duration as `H:mm:ss` for a timer.
 *
 * Hours are padded to two digits. Hours beyond 99 print in full. A
 * negative duration has a leading `-`.
 *
 * @param duration - A duration or a millisecond count.
 * @param options - `alwaysShowHours` defaults to `true`.
 * @returns The clock text.
 * @throws {@link TypeError} When `duration` is neither a number nor a duration.
 * @example
 * formatDurationAsClock({ hours: 1, minutes: 2, seconds: 3 }); // "01:02:03"
 */
export function formatDurationAsClock(
    duration: Duration | number,
    options?: FormatDurationAsClockOptions,
): string {
    const value =
        typeof duration === "number"
            ? assertFiniteNumber(duration, "duration")
            : assertDuration(duration, "duration");
    return formatClockText(
        value,
        options?.alwaysShowHours ?? true,
        options?.showMilliseconds ?? false,
    );
}
