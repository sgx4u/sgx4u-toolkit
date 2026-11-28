import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link isPlural}.
 *
 * Only English locales are accepted. Uncountable words are plural and singular.
 */
export interface IsPluralOptions {
    /** An English noun. */
    value: string;
    /**
     * An English language tag, such as `en` or `en-US`.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
