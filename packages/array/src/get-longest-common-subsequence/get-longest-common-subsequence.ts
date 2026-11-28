import type { GetLongestCommonSubsequenceParams } from "./get-longest-common-subsequence.types.js";
import type { Equals } from "../types/equals.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import { longestCommonSubsequence } from "../utils/sequence.utils.js";

/**
 * Returns one longest common subsequence.
 *
 * Result items come from `first`. When several subsequences have the same
 * length, earlier items of `first` are preferred. Either side not being an
 * array returns `undefined`. The inputs are not mutated.
 *
 * @param input - {@link GetLongestCommonSubsequenceParams}.
 * @returns A new array of shared items, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * getLongestCommonSubsequence({ first: [1, 2, 3, 4], second: [2, 4, 6] })
 */
export function getLongestCommonSubsequence<Item>(
    params: GetLongestCommonSubsequenceParams<Item>,
): Item[] | undefined;
export function getLongestCommonSubsequence(
    input: unknown,
): unknown[] | undefined;
export function getLongestCommonSubsequence(
    input: unknown,
): unknown[] | undefined {
    const params =
        readParams<GetLongestCommonSubsequenceParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const first = readArray(params.first);
    const second = readArray(params.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    return longestCommonSubsequence(
        first,
        second,
        resolveEquals(params.equals as Equals<unknown> | undefined),
    );
}
