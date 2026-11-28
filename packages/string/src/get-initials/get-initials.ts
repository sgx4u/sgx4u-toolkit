import { readInteger } from "../utils/assertions.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import { splitIntoWords } from "../utils/words.utils.js";
/** Returns the first grapheme of each word, sliced to `maximumLength`. @param value - The name. @returns The initials, or `undefined` when `value` is not a string. @example getInitials("Mary Jane Watson"); */
export function getInitials(value: string): string | undefined;
export function getInitials(options: {
    value: string;
    maximumLength?: number;
    locale?: string;
}): string | undefined;
export function getInitials(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        maximumLength: readInteger(
            "maximumLength",
            record.maximumLength,
            0,
            undefined,
            2,
        ),
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) return undefined;
    const locale = resolved.options.locale;
    const words =
        locale === undefined
            ? splitIntoWords(resolved.value)
            : splitIntoWords(resolved.value, { locale });
    const initials = words.map(
        (word) =>
            splitIntoUnits(word, "grapheme", resolved.options.locale)[0] ?? "",
    );
    return initials
        .slice(0, resolved.options.maximumLength)
        .join("")
        .toLocaleUpperCase();
}
