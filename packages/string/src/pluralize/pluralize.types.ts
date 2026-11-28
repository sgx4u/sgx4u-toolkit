import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link pluralize}.
 *
 * Only English locales are accepted. A bare string uses count `2`.
 */
export interface PluralizeOptions {
    /** An English noun. */
    value: string;
    /**
     * How many things the noun names.
     *
     * `1` returns the singular form. Every other finite number returns the
     * plural form, including `0` and negative numbers.
     *
     * @defaultValue 2
     */
    count?: number;
    /**
     * An English language tag, such as `en` or `en-US`.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
