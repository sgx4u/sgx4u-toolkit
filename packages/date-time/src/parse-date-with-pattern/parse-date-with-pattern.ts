import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { parseNumericPattern } from "../utils/parse-pattern.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { ParseDateWithPatternOptions } from "./parse-date-with-pattern.types.js";

/**
 * Parses text written with the same tokens as `formatDate`.
 *
 * Numeric tokens are matched exactly. A day that does not exist returns
 * `undefined`; the parser does not roll it into the next month. Missing
 * fields come from `referenceDate`, except time fields, which become zero
 * when any date field is present.
 *
 * @param value - The text to parse.
 * @param pattern - The CLDR-style pattern.
 * @param options - `referenceDate` defaults to the current time.
 * @returns A new `Date`, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` or `pattern` is not a string.
 * @throws {@link RangeError} When the pattern contains an unknown token.
 * @example
 * parseDateWithPattern("2026-11-26 03:30", "yyyy-MM-dd HH:mm", { timeZone: "Asia/Kolkata" })?.toISOString(); // "2026-11-25T22:00:00.000Z"
 */
export function parseDateWithPattern(
    value: string,
    pattern: string,
    options?: ParseDateWithPatternOptions,
): Date | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    if (typeof pattern !== "string") {
        throw typeError("pattern", "a string", pattern);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const reference = readDateParts(
        (options?.referenceDate === undefined
            ? resolveNow(undefined)
            : resolveDateInput(options.referenceDate, "referenceDate", timeZone)
        ).getTime(),
        timeZone,
    );
    const fields = parseNumericPattern(value, pattern, reference, true);
    if (fields === undefined) {
        return undefined;
    }
    try {
        return new Date(
            instantFromWallTime(
                {
                    year: fields.year ?? reference.year,
                    month: fields.month ?? 1,
                    day: fields.day ?? 1,
                    hour: fields.hour ?? 0,
                    minute: fields.minute ?? 0,
                    second: fields.second ?? 0,
                    millisecond: fields.millisecond ?? 0,
                },
                timeZone,
                resolveDisambiguation(options?.disambiguation),
            ),
        );
    } catch {
        return undefined;
    }
}
