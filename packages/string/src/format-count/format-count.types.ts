import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link formatCount}.
 *
 * `count` is required. Only English locales are accepted.
 */
export interface FormatCountOptions {
    /** The English noun to inflect. */
    value: string;
    /** How many things the phrase names. */
    count: number;
    /**
     * An English language tag used for the number and the noun.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
