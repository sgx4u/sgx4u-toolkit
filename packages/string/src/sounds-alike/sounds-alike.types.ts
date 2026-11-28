/** Which phonetic code {@link soundsAlike} compares. */
export type SoundsAlikeAlgorithm = "soundex" | "metaphone" | "double-metaphone";

/**
 * Options for {@link soundsAlike}.
 */
export interface SoundsAlikeOptions {
    /** The first word. */
    first: string;
    /** The second word. */
    second: string;
    /**
     * Which code to compare.
     *
     * `"double-metaphone"` matches when any of the four codes are equal.
     *
     * @defaultValue `"double-metaphone"`
     */
    algorithm?: SoundsAlikeAlgorithm;
}
