/**
 * Parameters for {@link zipToObject}.
 */
export interface ZipToObjectParams {
    /** Keys. Each key is stringified with `String`. */
    keys: readonly unknown[];

    /**
     * Values aligned with `keys`, or a function of the key and its index.
     *
     * A missing value is `undefined`.
     */
    values: readonly unknown[] | ((key: unknown, index: number) => unknown);
}
