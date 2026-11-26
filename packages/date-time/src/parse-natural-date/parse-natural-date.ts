import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { parseEnglishDate } from "../utils/natural-language.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { ParseNaturalDateParams } from "./parse-natural-date.types.js";

/**
 * Parses an English date phrase.
 *
 * Recognized phrases include `now`, `today`, `tomorrow`, `yesterday`,
 * `tonight`, `next Friday`, `in 3 days`, `3 weeks ago`, `a month from now`,
 * `Dec 25`, `25 December 2026`, `2026-11-26`, and times such as `5pm`,
 * `17:30`, `noon`, and `midnight`.
 *
 * @param params - `text` is required. `preferFuture` defaults to `true` and `now` to the current time.
 * @returns A new `Date`, or `undefined` when the phrase is not recognized.
 * @throws {@link TypeError} When `text` is not a string.
 * @throws {@link RangeError} When `timeZone` is invalid.
 * @example
 * parseNaturalDate({ text: "tomorrow", now: "2026-11-26T12:00:00Z", timeZone: "UTC" })?.toISOString(); // "2026-11-27T00:00:00.000Z"
 */
export function parseNaturalDate({
    text,
    timeZone,
    now: nowInput,
    preferFuture = true,
}: ParseNaturalDateParams): Date | undefined {
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
    return parseEnglishDate(text, now, zone, preferFuture);
}
