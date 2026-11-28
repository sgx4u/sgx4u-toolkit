import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `countOccurrences`. */
export interface CountOccurrencesOptions {
    value: string;
    search: string;
    /** @defaultValue false */ overlap?: boolean;
    /** @defaultValue false */ ignoreCase?: boolean;
    locale?: LocaleArgument;
}
