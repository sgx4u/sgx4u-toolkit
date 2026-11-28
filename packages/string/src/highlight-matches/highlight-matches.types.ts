/**
 * Options for `highlightMatches`.
 */
export interface HighlightMatchesOptions {
    /** The text to search. */
    value: string;
    /**
     * The text to wrap. An empty query leaves the text unchanged.
     *
     * @defaultValue `""`
     */
    query?: string;
    /**
     * When `true`, matches ignore case.
     *
     * @defaultValue true
     */
    ignoreCase?: boolean;
    /**
     * When `true`, `&`, `<`, `>`, `"`, and `'` are escaped before the
     * match is wrapped.
     *
     * @defaultValue true
     */
    escapeValue?: boolean;
    /**
     * Text inserted before each match.
     *
     * @defaultValue `"<mark>"`
     */
    prefix?: string;
    /**
     * Text inserted after each match.
     *
     * @defaultValue `"</mark>"`
     */
    suffix?: string;
}
