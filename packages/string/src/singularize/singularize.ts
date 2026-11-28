import { readEnglishLocale, singularForm } from "../utils/inflection.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { SingularizeOptions } from "./singularize.types.js";

/**
 * Returns the English singular of a noun.
 *
 * Uncountable words stay the same. The caller's casing is kept. The input
 * is not changed. Rule tables are not changed.
 *
 * @param value - An English noun.
 * @returns The singular form.
 * @example
 * singularize("cities");
 */
export function singularize(value: string): string;
/**
 * @param options - The noun and an optional English locale.
 * @returns The singular, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is not English.
 * @throws {@link TypeError} When `locale` is present and is not a string or a list of strings.
 */
export function singularize(options: SingularizeOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The singular, or `undefined` when the text is not a string.
 */
export function singularize(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readSingularizeOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return singularForm(resolved.value);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns The checked locale. The form itself does not take a locale argument.
 */
function readSingularizeOptions(record: Record<string, unknown>): {
    locale: ReturnType<typeof readEnglishLocale>;
} {
    return { locale: readEnglishLocale(record.locale) };
}
