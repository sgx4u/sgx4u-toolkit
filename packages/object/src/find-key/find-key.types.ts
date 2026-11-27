/**
 * Arguments for `findKey`.
 */
export interface FindKeyParams {
    /**
     * The value to search.
     *
     * A value that is not a plain object returns `undefined`.
     */
    object: unknown;
    /**
     * Returns true when `key` is the match.
     *
     * Called as `predicate(value, key, object)` in insertion order.
     */
    predicate: (
        value: unknown,
        key: string,
        object: Record<string, unknown>,
    ) => boolean;
}
