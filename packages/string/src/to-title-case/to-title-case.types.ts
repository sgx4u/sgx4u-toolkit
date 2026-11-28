import type { TitleCaseStyle } from "../types/string-unit.types.js";
import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `toTitleCase`. */
export interface ToTitleCaseOptions {
    /** The text to convert. */
    value: string;
    /** Locale for casing and for the small-word comparison. */
    locale?: LocaleArgument;
    /**
     * Which small-word list to use when `smallWords` is omitted.
     *
     * @defaultValue `"capitalize-every-word"`
     */
    style?: TitleCaseStyle;
    /** Small words kept lowercase except at the ends. */
    smallWords?: readonly string[];
}
