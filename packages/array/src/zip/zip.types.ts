/**
 * How {@link zip} chooses the number of tuples.
 */
export type ZipMode = "longest" | "shortest" | "strict";

/**
 * Parameters for {@link zip}.
 */
export interface ZipParams<Item> {
    /** Arrays to combine by index. Every slot must be an array. */
    arrays: readonly (readonly Item[])[];

    /**
     * Which tuples to keep.
     *
     * `"longest"` fills missing entries. `"shortest"` stops at the shortest
     * array. `"strict"` throws when the lengths differ.
     *
     * @defaultValue "longest"
     */
    mode?: ZipMode;

    /**
     * Value used for a missing entry when `mode` is `"longest"`.
     *
     * @defaultValue undefined
     */
    fillValue?: Item;
}
