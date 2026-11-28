import type { ArrayPatch } from "../types/patch.types.js";

/**
 * Arguments for {@link applyArrayPatch}.
 */
export interface ApplyArrayPatchParams<Item> {
    /** The array the patch is applied to. It is not mutated. */
    array: readonly Item[];
    /**
     * Keep, insert, and remove runs.
     *
     * `insert` appends items and consumes nothing. `keep` copies the next
     * source items when they match. `remove` skips the next source items
     * when they match. Matching uses SameValueZero.
     */
    patch: readonly ArrayPatch<Item>[];
}
