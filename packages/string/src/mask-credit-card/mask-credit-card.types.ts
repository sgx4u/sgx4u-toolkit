/**
 * Options for {@link maskCreditCard}.
 *
 * Digits are masked. Spaces and hyphens stay where they are. A value with
 * no digits returns `undefined`.
 */
export interface MaskCreditCardOptions {
    /** A card number that may contain spaces or hyphens. */
    value: string;
    /**
     * The mask text. The first grapheme replaces each masked digit.
     *
     * An empty string is rejected.
     *
     * @defaultValue `"*"`
     */
    maskCharacter?: string;
    /**
     * Digits left visible at the end.
     *
     * When the value has fewer digits than this length, every digit stays
     * visible.
     *
     * @defaultValue 4
     */
    unmaskedEndLength?: number;
}
