/**
 * Options for `isStrongPassword`.
 *
 * This is a policy check. It is not a measure of how hard a password is
 * to guess.
 */
export interface IsStrongPasswordOptions {
    /** The password to test. */
    value: string;
    /**
     * Minimum number of Unicode code points.
     *
     * @defaultValue 8
     */
    minimumLength?: number;
    /**
     * When `true`, a lowercase letter is required.
     *
     * @defaultValue true
     */
    requireLowercase?: boolean;
    /**
     * When `true`, an uppercase letter is required.
     *
     * @defaultValue true
     */
    requireUppercase?: boolean;
    /**
     * When `true`, a decimal number is required.
     *
     * @defaultValue true
     */
    requireNumber?: boolean;
    /**
     * When `true`, a character that is not a letter, number, or whitespace
     * is required.
     *
     * @defaultValue true
     */
    requireSymbol?: boolean;
}
