/**
 * Arguments for `pickBy`.
 */
export interface PickByParams {
    /** A plain object. Arrays, primitives, and `null` return `undefined`. */
    object: unknown;

    /**
     * Return `true` to copy the key.
     *
     * `value` is the own value, `key` is the enumerable string key, and
     * `object` is the input.
     */
    predicate: (
        value: unknown,
        key: string,
        object: Record<string, unknown>,
    ) => boolean;
}
