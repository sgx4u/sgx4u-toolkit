import { findIndex } from "../index-of-match/index-of-match.js";
import type { IndexOfMatchOptions } from "../index-of-match/index-of-match.types.js";

/**
 * Returns the last unit index of `search`, or -1 when it is missing.
 *
 * A non-string `value` returns `undefined`. The input is not changed.
 *
 * @param options - `value`, `search`, and the search options.
 * @returns The index, -1, or `undefined` when `value` is not a string.
 * @example
 * lastIndexOfMatch({ value: "ababa", search: "ba" });
 */
export function lastIndexOfMatch(
    options: IndexOfMatchOptions,
): number | undefined {
    return findIndex(options, true);
}
