/**
 * Options for `isNanoID`.
 */
export interface IsNanoIDOptions {
    /** The identifier to test. */
    value: string;
    /**
     * Expected number of characters.
     *
     * @defaultValue 21
     */
    length?: number;
    /**
     * Characters that may appear in the identifier.
     *
     * @defaultValue `"A-Za-z0-9_-"` as the 64-character NanoID alphabet
     */
    alphabet?: string;
}
