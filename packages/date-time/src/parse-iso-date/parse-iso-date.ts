import type { TimeZoneOptions } from "../types/options.types.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import { parseCalendarText } from "../utils/iso.utils.js";

/**
 * Parses `YYYY-MM-DD` as midnight in a time zone.
 *
 * An impossible day, such as February 30, returns `undefined`. The
 * function does not throw for text that does not match.
 *
 * @param value - The candidate text.
 * @param options - `timeZone` defaults to the system zone.
 * @returns A new `Date`, or `undefined` when the text is not a real calendar date.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * parseIsoDate("2026-11-26", { timeZone: "Asia/Kolkata" })?.toISOString(); // "2026-11-25T18:30:00.000Z"
 */
export function parseIsoDate(
    value: string,
    options?: TimeZoneOptions,
): Date | undefined {
    if (typeof value !== "string") {
        throw new TypeError(
            `\`value\` must be a string; received ${typeof value}.`,
        );
    }
    const calendar = parseCalendarText(value);
    if (calendar === undefined) {
        return undefined;
    }
    return new Date(
        instantFromWallTime(
            {
                ...calendar,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            resolveTimeZone(options?.timeZone),
            "compatible",
        ),
    );
}
