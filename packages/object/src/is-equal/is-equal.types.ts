/**
 * Arguments for `isEqual`.
 */
export interface IsEqualParams {
    /** The left value. */
    first: unknown;

    /** The right value. */
    second: unknown;

    /**
     * Compare enumerable symbol keys.
     *
     * @defaultValue `false`
     */
    includeSymbols?: boolean;

    /**
     * Compare non-enumerable string keys.
     *
     * @defaultValue `false`
     */
    includeNonEnumerable?: boolean;

    /**
     * Ignored. Cycles are always compared, including when this is `"throw"`
     * or any other value.
     */
    circular?: unknown;
}
