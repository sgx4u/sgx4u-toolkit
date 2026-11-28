import type { FoundDate } from "../types/natural-language.types.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { findEnglishDates } from "../utils/natural-language.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FindDatesInTextParams } from "./find-dates-in-text.types.js";

/**
 * Finds English date phrases in a longer text.
 *
 * Unrecognized text produces an empty array. Each result carries the
 * matched text, its index, and the instant. A range also carries `end`.
 *
 * @param params - `text` is required. `preferFuture` defaults to `true`.
 * @returns The matches, in the order they appear.
 * @throws {@link TypeError} When `text` is not a string.
 * @throws {@link RangeError} When `timeZone` is not a usable zone.
 * @example
 * findDatesInText({
 *   text: "See you tomorrow",
 *   now: "2026-11-26T12:00:00Z",
 *   timeZone: "UTC",
 * })[0]?.start.toISOString(); // "2026-11-27T00:00:00.000Z"
 */
export function findDatesInText({
    text,
    now,
    timeZone,
    preferFuture = true,
}: FindDatesInTextParams): FoundDate[] {
    if (typeof text !== "string") {
        throw typeError("text", "a string", text);
    }
    const zone = resolveTimeZone(timeZone);
    const nowInstant =
        now === undefined
            ? resolveNow(undefined).getTime()
            : readDateInput(now, zone)?.getTime();
    if (nowInstant === undefined) {
        return [];
    }
    return findEnglishDates(text, nowInstant, zone, preferFuture);
}
