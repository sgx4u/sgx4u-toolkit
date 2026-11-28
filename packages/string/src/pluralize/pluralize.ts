import {
    pluralForm,
    readCount,
    readEnglishLocale,
    singularForm,
} from "../utils/inflection.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
import type { PluralizeOptions } from "./pluralize.types.js";

/**
 * Settings after defaults and checks have been applied.
 */
interface PluralizeSettings {
    /** A finite count. `1` selects the singular. */
    count: number;
    /** An English locale. It is checked and then unused, because the rules are English. */
    locale: LocaleArgument;
}

/**
 * Returns the English singular or plural of a noun.
 *
 * Count `1` returns the singular. Every other finite count returns the
 * plural. The word is reduced to a singular before it is pluralized, so a
 * plural input is not pluralized twice. Uncountable words stay the same.
 * The input is not changed. Rule tables are not changed.
 *
 * @param value - An English noun. The count is `2`.
 * @returns The plural form.
 * @example
 * pluralize("city");
 */
export function pluralize(value: string): string;
/**
 * @param options - The noun, an optional count, and an optional English locale.
 * @returns The inflected noun, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `count` is present and is not a number.
 * @throws {@link RangeError} When `count` is not finite, or `locale` is not English.
 */
export function pluralize(options: PluralizeOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The inflected noun, or `undefined` when the text is not a string.
 */
export function pluralize(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readPluralizeOptions);
    if (resolved === undefined) {
        return undefined;
    }
    if (resolved.value.length === 0) {
        return "";
    }
    if (resolved.options.count === 1) {
        return singularForm(resolved.value);
    }
    return pluralForm(resolved.value);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns The checked count and locale.
 */
function readPluralizeOptions(
    record: Record<string, unknown>,
): PluralizeSettings {
    return {
        count: readCount(record.count, 2),
        locale: readEnglishLocale(record.locale),
    };
}
