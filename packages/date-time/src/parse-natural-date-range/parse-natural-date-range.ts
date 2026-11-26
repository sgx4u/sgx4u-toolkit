import type { Interval } from "../types/interval.types.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { parseEnglishRange } from "../utils/natural-language.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { ParseNaturalDateParams } from "../parse-natural-date/parse-natural-date.types.js";

/**
 * Fields for {@link parseNaturalDateRange}.
 */
export interface ParseNaturalDateRangeParams extends ParseNaturalDateParams {}

/**
 * Parses an English date range.
 *
 * Recognized ranges include `from Monday to Wednesday`, `Dec 24-26`,
 * `this weekend`, and `next week`. The result is half-open and includes
 * the last named day.
 *
 * @param params - `text` is required. `preferFuture` defaults to `true`.
 * @returns The interval, or `undefined` when the phrase is not a range.
 * @throws {@link TypeError} When `text` is not a string.
 * @throws {@link RangeError} When `timeZone` is invalid.
 * @example
 * parseNaturalDateRange({ text: "next week", now: "2026-11-26T12:00:00Z", timeZone: "UTC" })?.start.toISOString(); // "2026-11-30T00:00:00.000Z"
 */
export function parseNaturalDateRange({
    text,
    timeZone,
    now: nowInput,
    preferFuture = true,
}: ParseNaturalDateRangeParams): Interval | undefined {
    if (typeof text !== "string") {
        throw typeError("text", "a string", text);
    }
    const zone = resolveTimeZone(timeZone);
    const now =
        nowInput === undefined
            ? resolveNow(undefined).getTime()
            : readDateInput(nowInput, zone)?.getTime();
    if (now === undefined) {
        return undefined;
    }
    const parsed = parseEnglishRange(text, now, zone, preferFuture);
    if (parsed?.end === undefined) {
        return undefined;
    }
    return { start: parsed.date, end: parsed.end };
}