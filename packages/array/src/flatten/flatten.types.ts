/**
 * Parameters for {@link flatten}.
 *
 * A bare array is also accepted and uses a depth of `1`.
 */
export interface FlattenParams<Item = unknown> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * How many levels of nested arrays to open.
     *
     * `0` returns a shallow copy. Only arrays are opened. Other iterables
     * stay as they are.
     *
     * @defaultValue 1
     */
    depth?: number;
}
