/**
 * One run in a sequence patch that turns one array into another.
 */
export type ArrayPatch<Item> =
    | { type: "keep"; items: Item[] }
    | { type: "insert"; items: Item[] }
    | { type: "remove"; items: Item[] };

/**
 * A key-based comparison of two arrays.
 *
 * Identity is the key. `equals` decides whether two items that share a key
 * are `updated` or `unchanged`. `moved` is the same key and equal values
 * whose index changed.
 */
export interface KeyedArrayDiff<Item> {
    /** Items whose key is only in the next array. */
    added: Item[];
    /** Items whose key is only in the previous array. */
    removed: Item[];
    /** Items whose key matches and whose values are not equal. */
    updated: Array<{ previous: Item; next: Item }>;
    /** Equal items whose key matches and whose index changed. */
    moved: Array<{ item: Item; from: number; to: number }>;
    /** Equal items whose key matches and whose index is unchanged. */
    unchanged: Item[];
}
