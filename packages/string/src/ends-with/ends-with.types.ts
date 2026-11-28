import type { StringUnit } from "../types/string-unit.types.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `endsWith`. */
export interface EndsWithOptions {
    value: string;
    search: string;
    position?: number;
    /** @defaultValue `"grapheme"` */ unit?: StringUnit;
    /** @defaultValue false */ ignoreCase?: boolean;
    locale?: LocaleArgument;
}
