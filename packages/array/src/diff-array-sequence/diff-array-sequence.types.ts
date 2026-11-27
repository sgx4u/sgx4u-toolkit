import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link diffArraySequence}.
 */
export interface DiffArraySequenceParams<Item> {
    /** The previous sequence. It is not mutated. */
    first: readonly Item[];
    /** The next sequence. It is not mutated. */
    second: readonly Item[];
    /**
     * Compares two items.
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;
}
