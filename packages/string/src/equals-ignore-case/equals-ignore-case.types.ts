import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `equalsIgnoreCase`. */
export interface EqualsIgnoreCaseOptions {
    first: string;
    second: string;
    locale?: LocaleArgument;
}
