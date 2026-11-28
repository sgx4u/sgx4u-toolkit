import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link getIndefiniteArticle}.
 *
 * Only English locales are accepted.
 */
export interface GetIndefiniteArticleOptions {
    /** The word that follows the article. */
    value: string;
    /**
     * An English language tag.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
