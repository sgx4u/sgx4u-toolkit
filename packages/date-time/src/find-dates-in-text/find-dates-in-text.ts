import type { FoundDate } from "../types/natural-language.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { findEnglishDates } from "../utils/natural-language.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { ParseNaturalDateOptions } from "../parse-natural-date/parse-natural-date.types.js";

/**
 * Finds English date phrases in a longer text.
 *
 * Unrecognized text produces an empty array. Each result carries the
 * matched text, its index, and the instant. A range also carries `end`.
 *
 * @param text - The text to scan.
 * @param options - `preferFuture` defaults to `true`.
 * @returns The matches, in the order they appear.
 * @throws {@link TypeError} When `text` is not a string.
 * @example
 * findDatesInText("See you tomorrow", { now: "2026-11-26T12:00:00Z", timeZone: "UTC" })[0]?.start.toISOString(); // "2026-11-27T00:00:00.000Z"
 */
export function findDatesInText(
    text: string,
    options?: ParseNaturalDateOptions,
): FoundDate[] {
    if (typeof text !== "string") {
        throw typeError("text", "a string", text);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const now =
        options?.now === undefined
            ? resolveNow(undefined).getTime()
            : resolveDateInput(options.now, "now", timeZone).getTime();
    return findEnglishDates(text, now, timeZone, options?.preferFuture ?? true);
}
