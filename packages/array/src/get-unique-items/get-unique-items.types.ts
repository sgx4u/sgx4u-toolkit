import type { Equals } from "../types/equals.types.js";

/**
 * Which occurrence of a repeated item to keep.
 */
export type UniqueKeep = "first" | "last";

/**
 * Arguments for {@link getUniqueItems}.
 *
 * A bare array is also accepted and means `{ array, keep: "first" }`.
 */
export interface GetUniqueItemsParams<Item> {
    /**
     * Items to scan from left to right.
     */
    array: readonly Item[];
    /**
     * Equality for two items.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
    /**
     * Which occurrence to keep. `"last"` keeps the later item and the order of those later items.
     * @defaultValue "first"
     */
    keep?: UniqueKeep;
}
