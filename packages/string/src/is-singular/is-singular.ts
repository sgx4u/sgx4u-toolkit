import { readEnglishLocale, singularForm } from "../utils/inflection.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsSingularOptions } from "./is-singular.types.js";

/**
 * Reports whether an English noun is singular.
 *
 * Uncountable words such as `sheep` and `news` are singular. An empty
 * string is not. A non-string returns `false`. Comparison ignores case.
 * The input is not changed. Rule tables are not changed.
 *
 * @param value - An English noun.
 * @returns `true` when `value` is the singular form.
 * @example
 * isSingular("cat");
 */
export function isSingular(value: string): boolean;
/**
 * @param options - The noun and an optional English locale.
 * @returns `false` when `value` is not a string or is empty.
 * @throws {@link RangeError} When `locale` is not English.
 * @throws {@link TypeError} When `locale` is present and is not a string or a list of strings.
 */
export function isSingular(options: IsSingularOptions): boolean;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns `false` when the text is missing, empty, or not singular.
 */
export function isSingular(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readIsSingularOptions);
    if (resolved === undefined || resolved.value.length === 0) {
        return false;
    }
    const singular = singularForm(resolved.value);
    return (
        resolved.value.toLocaleLowerCase("en") ===
        singular.toLocaleLowerCase("en")
    );
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns Nothing meaningful. The locale is checked for its error.
 */
function readIsSingularOptions(record: Record<string, unknown>): {
    locale: ReturnType<typeof readEnglishLocale>;
} {
    return { locale: readEnglishLocale(record.locale) };
}
