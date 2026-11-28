/**
 * Options for {@link formatSprintf}.
 *
 * Only `%%`, `%s`, `%d`, `%i`, `%f`, `%j`, and numbered forms such as
 * `%1$s` are accepted. Width, precision, and flags are rejected.
 */
export interface FormatSprintfOptions {
    /** The template that contains `%` specifiers. */
    template: string;
    /** Arguments consumed by unnumbered specifiers and selected by numbered ones. */
    values: readonly unknown[];
}
