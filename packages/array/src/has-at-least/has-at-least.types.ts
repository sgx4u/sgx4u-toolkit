/**
 * Arguments for {@link hasAtLeast}.
 */
export interface HasAtLeastParams {
    /**
     * Value whose length is compared with `count`.
     *
     * A value that is not an array makes the result `false`.
     */
    array: unknown;

    /**
     * Minimum length that makes the result `true`.
     *
     * The comparison is `array.length >= count`. A value that is not a
     * finite number makes the result `false`. A negative finite number is
     * allowed, and every array is at least that long.
     */
    count: unknown;
}
