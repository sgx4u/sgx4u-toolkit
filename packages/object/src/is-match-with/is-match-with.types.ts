import type { MatchVisit } from "../is-match/is-match.types.js";

export type { MatchVisit } from "../is-match/is-match.types.js";

/**
 * Arguments for `isMatchWith`.
 */
export interface IsMatchWithParams {
    /** The value being tested. */
    object: unknown;

    /**
     * The required structure.
     *
     * Extra keys on `object` are allowed. `null` matches only `null`.
     */
    specification: unknown;

    /**
     * Return a boolean to decide this step. Return `undefined` to use the
     * default `isMatch` rule.
     */
    comparator: (details: MatchVisit) => boolean | undefined;
}
