import { typeError } from "../utils/error.utils.js";
import { parseHttpDateText } from "../utils/http-date.utils.js";

/**
 * Parses an HTTP date in IMF-fixdate, RFC 850, or asctime form.
 *
 * Text that does not match returns `undefined`. A two-digit RFC 850 year
 * uses the current time to decide the century.
 *
 * @param value - The candidate text.
 * @returns A new `Date`, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseHttpDate("Thu, 26 Nov 2026 22:00:00 GMT")?.toISOString(); // "2026-11-26T22:00:00.000Z"
 */
export function parseHttpDate(value: string): Date | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const instant = parseHttpDateText(value, Date.now());
    return instant === undefined ? undefined : new Date(instant);
}
