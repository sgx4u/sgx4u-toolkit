import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options shared by the programming case converters.
 */
export interface CaseConversionOptions {
    /** The text to convert. */
    value: string;
    /**
     * Locale passed to casing.
     *
     * @defaultValue the runtime locale
     */
    locale?: LocaleArgument;
    /**
     * When `true`, an acronym such as `ID` stays uppercase in camel, pascal, train, and pascal-snake.
     *
     * @defaultValue false
     */
    keepConsecutiveUppercase?: boolean;
    /**
     * When `true`, a letter and a neighboring digit stay in one word.
     *
     * @defaultValue false
     */
    mergeAmbiguousCharacters?: boolean;
}
