import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `includesAny`. */
export interface IncludesAnyOptions {
    value: string;
    searches: readonly string[];
    /** @defaultValue false */ ignoreCase?: boolean;
    locale?: LocaleArgument;
}
