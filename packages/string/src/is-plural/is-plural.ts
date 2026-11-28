import { pluralForm, readEnglishLocale } from "../utils/inflection.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsPluralOptions } from "./is-plural.types.js";

/**
 * Reports whether an English noun is plural.
 *
 * Uncountable words such as `sheep` and `news` are plural. An empty string
 * is not. A non-string returns `false`. Comparison ignores case. The input
 * is not changed. Rule tables are not changed.
 *
 * @param value - An English noun.
 * @returns `true` when `value` is the plural form.
 * @example
 * isPlural("cats");
 */
export function isPlural(value: string): boolean;
/**
 * @param options - The noun and an optional English locale.
 * @returns `false` when `value` is not a string or is empty.
 * @throws {@link RangeError} When `locale` is not English.
 * @throws {@link TypeError} When `locale` is present and is not a string or a list of strings.
 */
export function isPlural(options: IsPluralOptions): boolean;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns `false` when the text is missing, empty, or not plural.
 */
export function isPlural(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readIsPluralOptions);
    if (resolved === undefined || resolved.value.length === 0) {
        return false;
    }
    const plural = pluralForm(resolved.value);
    return (
        resolved.value.toLocaleLowerCase("en") ===
        plural.toLocaleLowerCase("en")
    );
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns Nothing meaningful. The locale is checked for its error.
 */
function readIsPluralOptions(record: Record<string, unknown>): {
    locale: ReturnType<typeof readEnglishLocale>;
} {
    return { locale: readEnglishLocale(record.locale) };
}
