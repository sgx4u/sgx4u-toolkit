/** Options for `trim`, `trimStart`, and `trimEnd`. */
export interface TrimOptions {
    /** The text to trim. */
    value: string;
    /**
     * Graphemes to remove. Omit to remove Unicode whitespace.
     */
    characters?: string;
}
