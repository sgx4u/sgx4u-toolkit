/**
 * How many named characters `escapeHTMLEntities` will use.
 *
 * `"xml"` is the five characters `&`, `<`, `>`, `"`, and `'`.
 * `"html4"` uses the HTML 4.01 names. `"html5"` uses the full named set.
 */
export type HtmlEntityLevel = "xml" | "html4" | "html5";

/**
 * Options for `escapeHTMLEntities`.
 */
export interface EscapeHTMLEntitiesOptions {
    /** The text to escape. */
    value: string;
    /**
     * Which named-character set to use.
     *
     * @defaultValue `"xml"`
     */
    level?: HtmlEntityLevel;
}
