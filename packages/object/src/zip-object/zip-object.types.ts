/**
 * An object built by pairing keys with values.
 *
 * Number keys are stored as strings. Symbol keys stay symbols.
 */
export interface ZippedObject {
    [key: string]: unknown;
    [key: symbol]: unknown;
}

/**
 * Arguments for `zipObject`.
 */
export interface ZipObjectParams {
    /**
     * Property names, paired by index.
     *
     * A non-array makes `zipObject` return `undefined`. An entry that is
     * not a string, number, or symbol is skipped.
     */
    keys: readonly unknown[];

    /**
     * Values paired with `keys`.
     *
     * When this is omitted or is not an array, every key is set to
     * `undefined`. Extra values are ignored.
     */
    values?: readonly unknown[];
}
