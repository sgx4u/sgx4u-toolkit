import type { StringUnit } from "../types/string-unit.types.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `startsWith`. */
export interface StartsWithOptions {
    value: string;
    search: string;
    /** @defaultValue 0 */
    position?: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
    /** @defaultValue false */
    ignoreCase?: boolean;
    locale?: LocaleArgument;
}
