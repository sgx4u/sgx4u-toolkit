import { typeError } from "../utils/error.utils.js";
import { parseFixedOffsetMinutes } from "../utils/time-zone.utils.js";

/**
 * Parses a UTC offset into minutes.
 *
 * `Z` is zero. `+05:30`, `+0530`, and `+05` are accepted.
 *
 * @param value - The candidate text.
 * @returns Minutes east of UTC, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseUtcOffset("+05:30"); // 330
 */
export function parseUtcOffset(value: string): number | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    if (value === "Z" || value === "z") {
        return 0;
    }
    return parseFixedOffsetMinutes(value);
}
