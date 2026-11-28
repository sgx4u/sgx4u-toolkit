import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `includes`. */
export interface IncludesOptions {
    value: string;
    search: string;
    /** @defaultValue false */ ignoreCase?: boolean;
    locale?: LocaleArgument | undefined;
}
