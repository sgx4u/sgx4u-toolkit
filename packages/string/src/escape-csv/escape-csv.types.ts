/**
 * Options for {@link escapeCSV}.
 *
 * A bare string uses a comma delimiter.
 */
export interface EscapeCSVOptions {
    /** One CSV field. */
    value: string;
    /**
     * The field separator the field is checked against.
     *
     * An empty delimiter is rejected.
     *
     * @defaultValue `","`
     */
    delimiter?: string;
}
