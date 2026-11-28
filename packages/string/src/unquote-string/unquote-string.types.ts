/**
 * Which quote `quoteString` and `unquoteString` use.
 */
export type QuoteStyle = "double" | "single" | "backtick";

/**
 * Options for `unquoteString`.
 */
export interface UnquoteStringOptions {
    /** The text to unwrap. */
    value: string;
    /**
     * Which quote to remove. Omit to accept `"`, `'`, or a backtick when
     * both ends use that same character.
     */
    style?: QuoteStyle;
}
