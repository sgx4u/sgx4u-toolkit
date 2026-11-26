import type { Duration } from "../types/duration.types.js";
import { typeError } from "../utils/error.utils.js";
import { parseISODurationText } from "../utils/duration-text.utils.js";

/**
 * Parses an ISO 8601 duration such as `P1Y2M3DT4H5M6.5S`.
 *
 * A fraction is allowed only on the last component. `P` and `PT` alone
 * return `undefined`.
 *
 * @param value - The candidate text.
 * @returns The duration, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseISODuration("PT1H30M"); // { hours: 1, minutes: 30 }
 */
export function parseISODuration(value: string): Duration | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    return parseISODurationText(value);
}
