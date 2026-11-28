import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `splitWords`. */
export interface SplitWordsOptions {
    /** The text to split. */
    value: string;
    /** Locale used for grapheme boundaries. */
    locale?: LocaleArgument;
    /**
     * Merge a letter with a neighboring digit.
     *
     * @defaultValue false
     */
    mergeAmbiguousCharacters?: boolean;
}
