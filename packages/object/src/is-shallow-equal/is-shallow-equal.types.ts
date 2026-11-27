/**
 * Arguments for `isShallowEqual`.
 */
export interface IsShallowEqualParams {
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
}
