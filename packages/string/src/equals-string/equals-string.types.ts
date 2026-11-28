import type { CollatorSensitivity } from "../types/string-unit.types.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `equalsString`. */
export interface EqualsStringOptions {
    first: string;
    second: string;
    /** @defaultValue `"variant"` */ sensitivity?: CollatorSensitivity;
    locale?: LocaleArgument | undefined;
}
