import {
    englishArticle,
    readEnglishLocale,
} from "../utils/inflection.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { GetIndefiniteArticleOptions } from "./get-indefinite-article.types.js";

/**
 * Returns the English indefinite article for a word.
 *
 * The choice follows pronunciation. `honour` takes `an` because the `h` is
 * silent. `unicorn` takes `a` because it starts with a "you" sound. `8`
 * takes `an`. `FBI` takes `an` because the letter name starts with a vowel
 * sound. The input is not changed.
 *
 * @param value - The following word.
 * @returns `"a"` or `"an"`.
 * @example
 * getIndefiniteArticle("honour");
 */
export function getIndefiniteArticle(value: string): string;
/**
 * @param options - The word and an optional English locale.
 * @returns `"a"` or `"an"`, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is not English.
 * @throws {@link TypeError} When `locale` is present and is not a string or a list of strings.
 */
export function getIndefiniteArticle(
    options: GetIndefiniteArticleOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The article, or `undefined` when the text is not a string.
 */
export function getIndefiniteArticle(
    valueOrOptions: unknown,
): string | undefined {
    const resolved = readStringCall(
        valueOrOptions,
        readIndefiniteArticleOptions,
    );
    if (resolved === undefined) {
        return undefined;
    }
    return englishArticle(resolved.value);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns The checked locale. The article itself does not take a locale argument.
 */
function readIndefiniteArticleOptions(record: Record<string, unknown>): {
    locale: ReturnType<typeof readEnglishLocale>;
} {
    return { locale: readEnglishLocale(record.locale) };
}
