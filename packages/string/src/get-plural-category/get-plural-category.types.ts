import type { LocaleArgument } from "../utils/locale.utils.js";

/** The `Intl.PluralRules` type selected by {@link getPluralCategory}. */
export type PluralCategoryType = "cardinal" | "ordinal";

/**
 * Options for {@link getPluralCategory}.
 *
 * A count that is not a finite number returns `undefined`. It does not
 * throw. An omitted locale uses the runtime locale, not a fixed English
 * default.
 */
export interface GetPluralCategoryOptions {
    /** The number to classify. */
    count: number;
    /**
     * Locale passed to `Intl.PluralRules`.
     *
     * When omitted, the runtime locale is used.
     */
    locale?: LocaleArgument;
    /**
     * Cardinal categories answer "how many". Ordinal categories answer
     * "which position".
     *
     * @defaultValue `"cardinal"`
     */
    type?: PluralCategoryType;
}
