import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link chunkBy}.
 */
export interface ChunkByParams<Item> {
    /**
     * Items to split where the key changes.
     */
    array: readonly Item[];
    /**
     * Property key or function. Consecutive equal results stay in one group.
     */
    by: Iteratee<Item>;
}
