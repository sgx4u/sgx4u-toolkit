import type { StringUnit } from "../types/string-unit.types.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `indexOfMatch` and `lastIndexOfMatch`. */
export interface IndexOfMatchOptions {
    value: string;
    search: string;
    /** @defaultValue 0 */ fromIndex?: number;
    /** @defaultValue `"grapheme"` */ unit?: StringUnit;
    /** @defaultValue false */ ignoreCase?: boolean;
    locale?: LocaleArgument;
}
