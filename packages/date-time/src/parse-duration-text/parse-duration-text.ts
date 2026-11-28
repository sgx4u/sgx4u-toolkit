import type { Duration } from "../types/duration.types.js";
import { typeError } from "../utils/error.utils.js";
import { isDurationValue } from "../utils/duration.utils.js";
import { parseDurationWords } from "../utils/duration-text.utils.js";

/**
 * Parses English duration text.
 *
 * Units may repeat and may appear in any order. A leading `-` negates
 * every field. `1:30:00` is also accepted. Anything else returns `undefined`.
 *
 * @param value - The candidate text.
 * @returns The duration, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseDurationText("1h 30m"); // { hours: 1, minutes: 30 }
 */
export function parseDurationText(value: string): Duration | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const duration = parseDurationWords(value);
    if (duration === undefined || !isDurationValue(duration)) {
        return undefined;
    }
    return duration;
}
