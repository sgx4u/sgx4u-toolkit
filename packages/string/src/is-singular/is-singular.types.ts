import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link isSingular}.
 *
 * Only English locales are accepted. Uncountable words are singular and plural.
 */
export interface IsSingularOptions {
    /** An English noun. */
    value: string;
    /**
     * An English language tag, such as `en` or `en-US`.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
