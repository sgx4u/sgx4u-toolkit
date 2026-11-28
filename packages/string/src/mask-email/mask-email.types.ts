/**
 * Options for {@link maskEmail}.
 *
 * The address is split on the first `@`. A value with no `@` returns
 * `undefined`.
 */
export interface MaskEmailOptions {
    /** An email address to mask. */
    value: string;
    /**
     * The mask text. The first grapheme replaces each masked grapheme.
     *
     * An empty string is rejected.
     *
     * @defaultValue `"*"`
     */
    maskCharacter?: string;
    /**
     * Graphemes of the local part left visible at the start.
     *
     * When the local part is shorter than this length, the local part is
     * left visible.
     *
     * @defaultValue 1
     */
    unmaskedLocalLength?: number;
    /**
     * When `true`, the domain is copied unchanged.
     *
     * When `false`, each domain grapheme other than `.` is masked. Dots
     * stay so the domain shape remains.
     *
     * @defaultValue true
     */
    unmaskedDomain?: boolean;
}
