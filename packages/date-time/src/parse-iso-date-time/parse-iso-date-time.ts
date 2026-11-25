import { typeError } from "../utils/error.utils.js";
import {
    instantFromLenientIso,
    parseLenientIsoDateTime,
} from "../utils/iso.utils.js";
import { resolveDisambiguation } from "../utils/time-zone.utils.js";
import type { ParseIsoDateTimeOptions } from "./parse-iso-date-time.types.js";

/**
 * Parses an ISO 8601, RFC 3339, or RFC 9557 date-time.
 *
 * A `Z`, `±HH:mm`, or `±HHmm` offset places the instant. Extra fractional
 * digits are truncated to milliseconds. A bracketed zone that disagrees
 * with the offset returns `undefined`. Text with no offset returns
 * `undefined` unless `defaultTimeZone` is set. Impossible calendar days
 * return `undefined`.
 *
 * @param value - The candidate text.
 * @param options - `disambiguation` defaults to `"compatible"`.
 * @returns A new `Date`, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `disambiguation` is not one of the four modes.
 * @example
 * parseIsoDateTime("2026-11-26T03:30:00+05:30")?.toISOString(); // "2026-11-25T22:00:00.000Z"
 */
export function parseIsoDateTime(
    value: string,
    options?: ParseIsoDateTimeOptions,
): Date | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const parsed = parseLenientIsoDateTime(value);
    if (parsed === undefined) {
        return undefined;
    }
    const disambiguation = resolveDisambiguation(options?.disambiguation);
    try {
        const instant = instantFromLenientIso(
            parsed,
            options?.defaultTimeZone,
            disambiguation,
        );
        return instant === undefined ? undefined : new Date(instant);
    } catch {
        return undefined;
    }
}
