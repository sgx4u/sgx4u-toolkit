import type {
    CollatorSensitivity,
    StringUnit,
    TitleCaseStyle,
    TruncationLocation,
    UnicodeForm,
} from "./string-unit.types.js";

/**
 * Defaults bound by `createString`, `createTransliterate`, and
 * `createHTMLEntities`.
 *
 * A value passed on a single call overrides the bound default. Two
 * instances do not share mutable state. Keys that are not listed throw
 * `RangeError` at runtime.
 */
export interface StringConfig {
    /**
     * Locale passed to `Intl` and to locale casing.
     *
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * Unit for length, slice, pad, mask, and distance helpers.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
    /**
     * When `true`, an acronym such as `ID` or `XML` stays in uppercase
     * in camel, pascal, train, and pascal-snake output.
     *
     * @defaultValue false
     */
    keepConsecutiveUppercase?: boolean;
    /**
     * When `true`, a letter and a neighboring digit stay in one word, and
     * separators between those runs are dropped. `V1.2` becomes `v12`.
     *
     * @defaultValue false
     */
    mergeAmbiguousCharacters?: boolean;
    /**
     * Small-word style used by `toTitleCase`.
     *
     * @defaultValue `"capitalize-every-word"`
     */
    titleCaseStyle?: TitleCaseStyle;
    /**
     * Small words kept lowercase by `toTitleCase`, compared
     * case-insensitively. When omitted, the list for `titleCaseStyle` is used.
     */
    smallWords?: readonly string[];
    /**
     * Separator inserted by `slugify`.
     *
     * @defaultValue `"-"`
     */
    slugifySeparator?: string;
    /**
     * When `true`, `slugify` lowercases the result.
     *
     * @defaultValue true
     */
    slugifyLowerCase?: boolean;
    /**
     * Text inserted by truncation helpers.
     *
     * @defaultValue `"\u2026"`
     */
    truncationOmission?: string;
    /**
     * Where truncation keeps the original text.
     *
     * @defaultValue `"end"`
     */
    truncationLocation?: TruncationLocation;
    /**
     * Character used by the mask helpers. The first grapheme is used.
     *
     * @defaultValue `"*"`
     */
    maskCharacter?: string;
    /**
     * Units left visible at the start of `maskString`.
     *
     * @defaultValue 0
     */
    unmaskedStartLength?: number;
    /**
     * Units left visible at the end of `maskString` and `maskCreditCard`.
     *
     * @defaultValue 0
     */
    unmaskedEndLength?: number;
    /**
     * Collator sensitivity for `equalsString` and `compareStrings`.
     *
     * @defaultValue `"variant"`
     */
    collatorSensitivity?: CollatorSensitivity;
    /**
     * When `true`, comparison uses numeric collation.
     *
     * @defaultValue false
     */
    numericCollation?: boolean;
    /**
     * Normalization form used by `normalizeUnicode` and `equalsNormalized`.
     *
     * @defaultValue `"NFC"`
     */
    normalizeForm?: UnicodeForm;
    /**
     * Words per minute used by `getReadingTime`.
     *
     * @defaultValue 200
     */
    wordsPerMinute?: number;
    /**
     * Placeholder style used by `interpolate`.
     *
     * `"curly"` matches `{name}`. `"double-curly"` matches `{{name}}`.
     *
     * @defaultValue `"curly"`
     */
    templatePattern?: "curly" | "double-curly";
}
