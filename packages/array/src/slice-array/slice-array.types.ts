/**
 * Arguments for {@link sliceArray}.
 */
export interface SliceArrayParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * Index at which to start.
     *
     * A negative index counts from the end and is clamped, as
     * `Array#slice` does. A finite non-integer is truncated toward zero.
     * `NaN` and infinities throw.
     *
     * @defaultValue 0
     */
    start?: number;

    /**
     * Index at which to stop, exclusive.
     *
     * A negative index counts from the end and is clamped, as
     * `Array#slice` does. A finite non-integer is truncated toward zero.
     * `NaN` and infinities throw.
     *
     * @defaultValue the array length
     */
    end?: number;
}
