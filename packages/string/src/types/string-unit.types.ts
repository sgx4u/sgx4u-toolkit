/**
 * The unit used to count, slice, and index a string.
 *
 * `"grapheme"` is a user-perceived character from `Intl.Segmenter`.
 * `"codePoint"` is a Unicode scalar value. `"codeUnit"` is a UTF-16 code
 * unit, the same count as `String.prototype.length`.
 */
export type StringUnit = "grapheme" | "codePoint" | "codeUnit";

/**
 * A Unicode normalization form accepted by `String.prototype.normalize`.
 */
export type UnicodeForm = "NFC" | "NFD" | "NFKC" | "NFKD";

/**
 * Where `truncate` keeps the original text and where it places the omission.
 */
export type TruncationLocation = "end" | "start" | "middle";

/**
 * `Intl.Collator` sensitivity.
 *
 * `"accent"` ignores case and keeps accents. `"variant"` keeps case and accents.
 */
export type CollatorSensitivity = "base" | "accent" | "case" | "variant";

/**
 * How `toTitleCase` treats short function words.
 *
 * `"capitalize-every-word"` capitalizes each word. `"apa"` and `"chicago"`
 * keep a small-word list lowercase unless the word is first or last.
 */
export type TitleCaseStyle = "capitalize-every-word" | "apa" | "chicago";

/**
 * Algorithm used by `getSimilarity` and the closest-match helpers.
 *
 * `"normalized-levenshtein"` is `1 - distance / max(length, length)`.
 */
export type SimilarityAlgorithm =
    "jaro-winkler" | "dice" | "normalized-levenshtein";

/**
 * UUID version accepted by `isUUID`.
 *
 * `"any"` allows versions 1 through 8 plus the nil and max UUIDs.
 * A number checks the version nibble. `"nil"` and `"max"` check those
 * exact values.
 */
export type UUIDVersion = "any" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "nil" | "max";

/**
 * A reading-time estimate.
 *
 * `minutes` is `words / wordsPerMinute` and may be fractional. `words`
 * uses the same word split as `countWords`.
 */
export interface ReadingTime {
    /** Word count divided by the chosen words per minute. */
    minutes: number;
    /** Words in the value. */
    words: number;
}

/**
 * One candidate from a closest-match search.
 *
 * `score` is 0 to 1. A higher score is closer. `index` is the position
 * in the candidate list that was passed in.
 */
export interface ClosestMatch {
    /** The candidate text. */
    value: string;
    /** Index of `value` in the candidate list. */
    index: number;
    /** Similarity from 0 to 1. Higher is closer. */
    score: number;
}
