import type { CollatorSensitivity } from "../types/string-unit.types.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
/** Options for `compareStrings`. */
export interface CompareStringsOptions {
    first: string;
    second: string;
    locale?: LocaleArgument;
    /** @defaultValue false */ numeric?: boolean;
    /** @defaultValue `"variant"` */ sensitivity?: CollatorSensitivity;
}
