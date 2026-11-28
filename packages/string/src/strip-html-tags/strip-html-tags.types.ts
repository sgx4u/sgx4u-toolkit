/**
 * Options for {@link stripHTMLTags}.
 *
 * A bare string removes every tag. This scanner is not a sanitizer.
 */
export interface StripHTMLTagsOptions {
    /** Text that may contain tags. */
    value: string;
    /**
     * Tag names to keep, compared as lowercase ASCII names.
     *
     * The original tag text is copied when the name is listed. Attributes
     * on a kept tag are copied with it. Names that are not listed are
     * removed, and the text between tags stays.
     *
     * @defaultValue `[]`
     */
    allowedTags?: readonly string[];
}
