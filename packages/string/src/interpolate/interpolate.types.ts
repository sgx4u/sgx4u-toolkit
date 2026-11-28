/** Which braces `interpolate` treats as a placeholder. */
export type InterpolatePattern = "curly" | "double-curly";

/** What `interpolate` writes when a key is not an own property of `values`. */
export type InterpolateMissing = "empty" | "keep";

/**
 * Options for {@link interpolate}.
 *
 * Placeholders are not evaluated. A value is stringified with `String`.
 */
export interface InterpolateOptions {
    /** The template that contains placeholders. */
    template: string;
    /**
     * Own properties used to fill placeholders.
     *
     * Keys are matched exactly. Inherited properties are not used.
     */
    values: Record<string, unknown>;
    /**
     * `"curly"` matches `{name}`. `"double-curly"` matches `{{name}}`.
     *
     * A key is ASCII letters, digits, and underscore.
     *
     * @defaultValue `"curly"`
     */
    pattern?: InterpolatePattern;
    /**
     * `"empty"` replaces a missing key with `""`. `"keep"` leaves the
     * placeholder text in the result.
     *
     * A key that is present with the value `undefined` is not missing.
     * `String(undefined)` is `"undefined"`.
     *
     * @defaultValue `"empty"`
     */
    missing?: InterpolateMissing;
}
