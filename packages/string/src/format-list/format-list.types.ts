import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `formatList`. */
export interface FormatListOptions {
    /** The items to format. */
    values: readonly string[];
    /** Locale passed to `Intl.ListFormat`. */
    locale?: LocaleArgument;
    /** @defaultValue `"conjunction"` */
    type?: "conjunction" | "disjunction" | "unit";
    /** @defaultValue `"long"` */
    style?: "long" | "short" | "narrow";
}
