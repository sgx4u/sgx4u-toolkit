import type { Duration } from "../types/duration.types.js";
import { readDuration } from "../utils/duration.utils.js";
import { formatISODurationText } from "../utils/duration-text.utils.js";

/**
 * Formats a duration as an ISO 8601 duration.
 *
 * A zero duration is `PT0S`.
 *
 * @param duration - The duration to format.
 * @returns The ISO text, or `undefined` when `duration` is not usable.
 * @example
 * formatISODuration({ hours: 1, minutes: 30 }); // "PT1H30M"
 */
export function formatISODuration(duration: Duration): string | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    return formatISODurationText(checked);
}
