import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link singularize}.
 *
 * Only English locales are accepted.
 */
export interface SingularizeOptions {
    /** An English noun. */
    value: string;
    /**
     * An English language tag, such as `en` or `en-US`.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
