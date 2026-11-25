import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { parseEnglishDate } from "../utils/natural-language.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { ParseNaturalDateOptions } from "./parse-natural-date.types.js";

/**
 * Parses an English date phrase.
 *
 * Recognized phrases include `now`, `today`, `tomorrow`, `yesterday`,
 * `tonight`, `next Friday`, `in 3 days`, `3 weeks ago`, `a month from now`,
 * `Dec 25`, `25 December 2026`, `2026-11-26`, and times such as `5pm`,
 * `17:30`, `noon`, and `midnight`.
 *
 * @param text - The phrase.
 * @param options - `preferFuture` defaults to `true` and `now` to the current time.
 * @returns A new `Date`, or `undefined` when the phrase is not recognized.
 * @throws {@link TypeError} When `text` is not a string.
 * @example
 * parseNaturalDate("tomorrow", { now: "2026-11-26T12:00:00Z", timeZone: "UTC" })?.toISOString(); // "2026-11-27T00:00:00.000Z"
 */
export function parseNaturalDate(
    text: string,
    options?: ParseNaturalDateOptions,
): Date | undefined {
    if (typeof text !== "string") {
        throw typeError("text", "a string", text);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const now =
        options?.now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(options.now, "now", timeZone).getTime();
    return parseEnglishDate(text, now, timeZone, options?.preferFuture ?? true);
}
