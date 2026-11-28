/**
 * Options for `isCUID2`.
 */
export interface IsCUID2Options {
    /** The identifier to test. */
    value: string;
    /**
     * Expected length, counting every character.
     *
     * The first character is still a lowercase letter.
     *
     * @defaultValue 24
     */
    length?: number;
}
