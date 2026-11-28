/**
 * How custom word lists combine with the built-in vocabulary.
 *
 * `"extend"` adds custom words to the English tokens and, when a locale is
 * set, that language's yes/no words. `"replace"` uses only the custom lists.
 * Primitive booleans and the numbers `0` and `1` stay accepted either way.
 */
export type WordListMode = "extend" | "replace";

/**
 * Which side of a boolean vocabulary to read.
 */
export type BooleanWordCategory = "truthy" | "falsy" | "all";

/**
 * Yes words and no words, already copied for the caller.
 */
export interface BooleanWords {
    /** Words that parse as `true`. */
    truthy: string[];
    /** Words that parse as `false`. */
    falsy: string[];
}

/**
 * Options shared by `parseBoolean` and `isParseableBoolean`.
 *
 * A direct call can omit the object. `createBoolean` stores the same fields
 * as defaults. A field set on one call replaces the stored default.
 */
export interface BooleanParseOptions {
    /**
     * BCP 47 tag whose language subtag selects yes/no words.
     *
     * `hi-IN` uses `hi`. An unknown language adds no words. English tokens
     * still apply when `wordListMode` is `"extend"`.
     *
     * @defaultValue undefined
     */
    locale?: string;

    /**
     * Extra words that parse as `true`, or the only truthy words when
     * `wordListMode` is `"replace"`.
     *
     * @defaultValue undefined
     */
    truthyWords?: readonly string[];

    /**
     * Extra words that parse as `false`, or the only falsy words when
     * `wordListMode` is `"replace"`.
     *
     * @defaultValue undefined
     */
    falsyWords?: readonly string[];

    /**
     * Whether custom lists add to the built-in vocabulary or replace it.
     *
     * @defaultValue "extend"
     */
    wordListMode?: WordListMode;

    /**
     * When `true`, word matching keeps the characters as written.
     *
     * @defaultValue false
     */
    caseSensitive?: boolean;

    /**
     * When `true`, surrounding whitespace is removed before a string is matched.
     *
     * @defaultValue true
     */
    trim?: boolean;

    /**
     * When `true`, English `yes` or `no` with one neighboring-key typo is
     * accepted after the strict word lists miss.
     *
     * Locale words, `true` / `false`, `on` / `off`, and custom words are not
     * typo-matched.
     *
     * @defaultValue false
     */
    lenient?: boolean;
}

/**
 * `parseBoolean` argument when the call sets options.
 */
export interface ParseBooleanInput extends BooleanParseOptions {
    /** Value to recognize. Objects and arrays are not tokens. */
    value: unknown;

    /**
     * Boolean returned when `value` is not recognized.
     *
     * When omitted, an unrecognized value returns `undefined`.
     *
     * @defaultValue undefined
     */
    fallback?: boolean;
}

/**
 * `isParseableBoolean` argument when the call sets options.
 *
 * `fallback` is not part of this input. A recognized value is `true` or
 * `false` before any fallback is applied.
 */
export interface IsParseableBooleanInput extends BooleanParseOptions {
    /** Value to test. */
    value: unknown;
}

/**
 * `getBooleanWords` argument. Both fields are optional.
 */
export interface GetBooleanWordsInput {
    /**
     * BCP 47 tag. The language subtag selects yes/no words to append.
     *
     * @defaultValue "en"
     */
    locale?: string;

    /**
     * Which side to fill. The other side is an empty array.
     *
     * @defaultValue "all"
     */
    category?: BooleanWordCategory;
}
