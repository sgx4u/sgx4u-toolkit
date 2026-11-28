/**
 * How `isBase64` treats `=` padding.
 *
 * `"required"` means the text length is a multiple of 4 and any needed
 * padding is present. `"optional"` also accepts the same text with that
 * padding left off. Padding that is present must still be the right length.
 */
export type Base64Padding = "required" | "optional";

/**
 * Options for `isBase64`.
 */
export interface IsBase64Options {
    /** The text to test. */
    value: string;
    /**
     * When `true`, the alphabet uses `-` and `_` instead of `+` and `/`.
     *
     * @defaultValue false
     */
    urlSafe?: boolean;
    /**
     * Whether padding must be present.
     *
     * @defaultValue `"optional"`
     */
    padding?: Base64Padding;
}
