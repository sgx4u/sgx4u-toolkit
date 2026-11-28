import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { formatCompactText } from "../utils/duration-text.utils.js";
import type { FormatDurationCompactParams } from "./format-duration-compact.types.js";

/**
 * Formats a duration with compact unit symbols such as `1h 30m`.
 *
 * Zero is `0s`.
 *
 * @param params - `duration` is required. `maximumUnitCount` defaults to `2` and `separator` to a space.
 * @returns The compact text, or `undefined` when `duration` or `maximumUnitCount` is not usable.
 * @throws {@link RangeError} When `maximumUnitCount` is not a positive integer.
 * @example
 * formatDurationCompact({ duration: { hours: 1, minutes: 30 } }); // "1h 30m"
 */
export function formatDurationCompact({
    duration,
    maximumUnitCount = 2,
    separator = " ",
}: FormatDurationCompactParams): string | undefined {
    if (
        typeof maximumUnitCount !== "number" ||
        !Number.isInteger(maximumUnitCount)
    ) {
        return undefined;
    }
    if (maximumUnitCount < 1) {
        throw rangeError(
            "maximumUnitCount",
            "a positive integer",
            maximumUnitCount,
        );
    }
    const value =
        typeof duration === "number"
            ? Number.isFinite(duration)
                ? duration
                : undefined
            : readDuration(duration);
    if (value === undefined) {
        return undefined;
    }
    return formatCompactText(value, maximumUnitCount, separator);
}
