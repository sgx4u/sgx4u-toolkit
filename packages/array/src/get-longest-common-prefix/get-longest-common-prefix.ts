import type { GetLongestCommonPrefixParams } from "./get-longest-common-prefix.types.js";
import type { Equals } from "../types/equals.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import { commonPrefix } from "../utils/sequence.utils.js";

/**
 * Returns the shared leading items.
 *
 * Result items come from `first`. Either side not being an array returns
 * `undefined`. The inputs are not mutated.
 *
 * @param input - {@link GetLongestCommonPrefixParams}.
 * @returns A new array of the shared prefix, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * getLongestCommonPrefix({ first: [1, 2, 3], second: [1, 2, 9] })
 */
export function getLongestCommonPrefix<Item>(
    params: GetLongestCommonPrefixParams<Item>,
): Item[] | undefined;
export function getLongestCommonPrefix(input: unknown): unknown[] | undefined;
export function getLongestCommonPrefix(input: unknown): unknown[] | undefined {
    const params = readParams<GetLongestCommonPrefixParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const first = readArray(params.first);
    const second = readArray(params.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    return commonPrefix(
        first,
        second,
        resolveEquals(params.equals as Equals<unknown> | undefined),
    );
}
