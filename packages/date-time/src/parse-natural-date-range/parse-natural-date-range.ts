import type { Interval } from "../types/interval.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { parseEnglishRange } from "../utils/natural-language.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { ParseNaturalDateOptions } from "../parse-natural-date/parse-natural-date.types.js";

/**
 * Parses an English date range.
 *
 * Recognized ranges include `from Monday to Wednesday`, `Dec 24-26`,
 * `this weekend`, and `next week`. The result is half-open and includes
 * the last named day.
 *
 * @param text - The phrase.
 * @param options - `preferFuture` defaults to `true`.
 * @returns The interval, or `undefined` when the phrase is not a range.
 * @throws {@link TypeError} When `text` is not a string.
 * @example
 * parseNaturalDateRange("next week", { now: "2026-11-26T12:00:00Z", timeZone: "UTC" })?.start.toISOString(); // "2026-11-30T00:00:00.000Z"
 */
export function parseNaturalDateRange(
    text: string,
    options?: ParseNaturalDateOptions,
): Interval | undefined {
    if (typeof text !== "string") {
        throw typeError("text", "a string", text);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const now =
        options?.now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(options.now, "now", timeZone).getTime();
    const parsed = parseEnglishRange(
        text,
        now,
        timeZone,
        options?.preferFuture ?? true,
    );
    if (parsed?.end === undefined) {
        return undefined;
    }
    return { start: parsed.date, end: parsed.end };
}
