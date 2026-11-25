import type { Duration } from "../types/duration.types.js";
import { assertInteger } from "../utils/assert.utils.js";
import { assertFiniteNumber } from "../utils/assert.utils.js";
import { assertDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { formatCompactText } from "../utils/duration-text.utils.js";
import type { FormatDurationCompactOptions } from "./format-duration-compact.types.js";

/**
 * Formats a duration with compact unit symbols such as `1h 30m`.
 *
 * Zero is `0s`.
 *
 * @param duration - A duration or a millisecond count.
 * @param options - `maximumUnitCount` defaults to `2` and `separator` to a space.
 * @returns The compact text.
 * @throws {@link RangeError} When `maximumUnitCount` is not a positive integer.
 * @example
 * formatDurationCompact({ hours: 1, minutes: 30 }); // "1h 30m"
 */
export function formatDurationCompact(
    duration: Duration | number,
    options?: FormatDurationCompactOptions,
): string {
    const maximumUnitCount = assertInteger(
        options?.maximumUnitCount ?? 2,
        "maximumUnitCount",
    );
    if (maximumUnitCount < 1) {
        throw rangeError(
            "maximumUnitCount",
            "a positive integer",
            maximumUnitCount,
        );
    }
    const value =
        typeof duration === "number"
            ? assertFiniteNumber(duration, "duration")
            : assertDuration(duration, "duration");
    return formatCompactText(
        value,
        maximumUnitCount,
        options?.separator ?? " ",
    );
}
