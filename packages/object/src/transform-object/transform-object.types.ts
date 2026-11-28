/**
 * Arguments for `transformObject`.
 *
 * @typeParam A - The accumulator type.
 */
export interface TransformObjectParams<A> {
    /**
     * The value to reduce.
     *
     * A value that is not a plain object returns `undefined`.
     */
    object: unknown;
    /**
     * Combines one own enumerable string key into the accumulator.
     *
     * Called as `transformer(accumulator, value, key, object)` in insertion
     * order. The caller owns `accumulator`; this function does not copy it.
     */
    transformer: (
        accumulator: A,
        value: unknown,
        key: string,
        object: Record<string, unknown>,
    ) => A;
    /** The accumulator passed to the first key. */
    initial: A;
}
