/**
 * Arguments for `findLastKey`.
 */
export interface FindLastKeyParams {
    /**
     * The value to search.
     *
     * A value that is not a plain object returns `undefined`.
     */
    object: unknown;
    /**
     * Returns true when `key` is a match.
     *
     * Called as `predicate(value, key, object)`. The last truthy result wins.
     */
    predicate: (
        value: unknown,
        key: string,
        object: Record<string, unknown>,
    ) => boolean;
}
