import { typeError } from "../utils/error.utils.js";
import { parseRFC2822Text } from "../utils/rfc2822.utils.js";

/**
 * Parses an email date header.
 *
 * The weekday and the seconds are optional. Numeric offsets and the
 * obsolete zone names are accepted. Text that does not match returns
 * `undefined`.
 *
 * @param value - The candidate text.
 * @returns A new `Date`, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseRFC2822Date("Thu, 26 Nov 2026 03:30:00 +0530")?.toISOString(); // "2026-11-25T22:00:00.000Z"
 */
export function parseRFC2822Date(value: string): Date | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const instant = parseRFC2822Text(value);
    return instant === undefined ? undefined : new Date(instant);
}
