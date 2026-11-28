/**
 * Options for {@link slugify}.
 *
 * `value` is the only required field. A bare string is the same call as
 * `{ value }` with the defaults.
 */
export interface SlugifyOptions {
    /** Text to turn into a slug. */
    value: string;
    /**
     * Text inserted for each run of characters that are not letters or digits.
     *
     * An empty separator is rejected.
     *
     * @defaultValue `"-"`
     */
    separator?: string;
    /**
     * When `true`, the slug is lowercased with the English locale.
     *
     * @defaultValue true
     */
    lowerCase?: boolean;
    /**
     * Maximum number of graphemes kept from the start of the slug.
     *
     * When omitted, the slug is not shortened. `0` produces an empty slug.
     * A negative length is rejected. The slice never cuts a grapheme, and a
     * trailing separator left by the slice is removed.
     */
    maximumLength?: number;
}
