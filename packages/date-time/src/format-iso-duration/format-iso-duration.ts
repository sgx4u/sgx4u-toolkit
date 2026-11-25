import type { Duration } from "../types/duration.types.js";
import { assertDuration } from "../utils/duration.utils.js";
import { formatIsoDurationText } from "../utils/duration-text.utils.js";

/**
 * Formats a duration as an ISO 8601 duration.
 *
 * A zero duration is `PT0S`.
 *
 * @param duration - The duration to format.
 * @returns The ISO text.
 * @throws {@link RangeError} When `duration` is not a valid duration.
 * @example
 * formatIsoDuration({ hours: 1, minutes: 30 }); // "PT1H30M"
 */
export function formatIsoDuration(duration: Duration): string {
    return formatIsoDurationText(assertDuration(duration, "duration"));
}
