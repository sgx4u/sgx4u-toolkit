import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `includesAll`. */
export interface IncludesAllOptions {
    value: string;
    searches: readonly string[];
    /** @defaultValue false */ ignoreCase?: boolean;
    locale?: LocaleArgument;
}
