import type { EqualVisit } from "../utils/equal.utils.js";

export type { EqualVisit } from "../utils/equal.utils.js";

/**
 * Arguments for `isEqualWith`.
 */
export interface IsEqualWithParams {
    /** The left value. */
    first: unknown;

    /** The right value. */
    second: unknown;

    /**
     * Return a boolean to decide this pair. Return `undefined` to use the
     * default deep-equality rule.
     */
    comparator: (details: EqualVisit) => boolean | undefined;

    /**
     * Compare enumerable symbol keys.
     *
     * @defaultValue `false`
     */
    includeSymbols?: boolean;
}
