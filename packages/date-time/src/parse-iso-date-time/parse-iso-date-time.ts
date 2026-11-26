import { typeError } from "../utils/error.utils.js";
import {
    instantFromLenientISO,
    parseLenientISODateTime,
} from "../utils/iso.utils.js";
import { resolveDisambiguation } from "../utils/time-zone.utils.js";
import type { ParseISODateTimeParams } from "./parse-iso-date-time.types.js";

/**
 * Parses an ISO 8601, RFC 3339, or RFC 9557 date-time.
 *
 * A `Z`, `±HH:mm`, or `±HHmm` offset places the instant. Extra fractional
 * digits are truncated to milliseconds. A bracketed zone that disagrees
 * with the offset returns `undefined`. Text with no offset returns
 * `undefined` unless `defaultTimeZone` is set. Impossible calendar days
 * return `undefined`.
 *
 * @param params - `value` is required. `disambiguation` defaults to `"compatible"`.
 * @returns A new `Date`, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `disambiguation` is not one of the four modes.
 * @example
 * parseISODateTime({ value: "2026-11-26T03:30:00+05:30" })?.toISOString(); // "2026-11-25T22:00:00.000Z"
 */
export function parseISODateTime({
    value,
    defaultTimeZone,
    disambiguation,
}: ParseISODateTimeParams): Date | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const parsed = parseLenientISODateTime(value);
    if (parsed === undefined) {
        return undefined;
    }
    const resolvedDisambiguation = resolveDisambiguation(disambiguation);
    try {
        const instant = instantFromLenientISO(
            parsed,
            defaultTimeZone,
            resolvedDisambiguation,
        );
        return instant === undefined ? undefined : new Date(instant);
    } catch {
        return undefined;
    }
}