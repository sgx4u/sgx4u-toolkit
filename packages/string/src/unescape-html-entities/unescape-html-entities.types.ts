import type { HtmlEntityLevel } from "../escape-html-entities/escape-html-entities.types.js";

/**
 * Options for `unescapeHTMLEntities`.
 */
export interface UnescapeHTMLEntitiesOptions {
    /** The text that may contain character references. */
    value: string;
    /**
     * Which named characters are recognized. Numeric references are
     * recognized at every level.
     *
     * @defaultValue `"xml"`
     */
    level?: HtmlEntityLevel;
}

export type { HtmlEntityLevel } from "../escape-html-entities/escape-html-entities.types.js";
