import type { PathSegment } from "../types/path.types.js";

/**
 * Arguments for `isMatch`.
 */
export interface IsMatchParams {
    /** The value being tested. */
    object: unknown;

    /**
     * The required structure.
     *
     * Extra keys on `object` are allowed. `null` matches only `null`.
     */
    specification: unknown;
}

/**
 * One step passed to an `isMatchWith` comparator.
 */
export interface MatchVisit {
    /** The value being tested at this step. */
    object: unknown;

    /** The required value at this step. */
    specification: unknown;

    /** The key or index that selected this step. Omitted at the root. */
    key?: PropertyKey;

    /** The path from the root. */
    path: PathSegment[];
}
