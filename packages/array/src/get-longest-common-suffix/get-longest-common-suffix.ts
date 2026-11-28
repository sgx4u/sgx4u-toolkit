import type { GetLongestCommonSuffixParams } from "./get-longest-common-suffix.types.js";
import type { Equals } from "../types/equals.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import { commonSuffix } from "../utils/sequence.utils.js";

/**
 * Returns the shared trailing items, in forward order.
 *
 * Result items come from `first`. Either side not being an array returns
 * `undefined`. The inputs are not mutated.
 *
 * @param input - {@link GetLongestCommonSuffixParams}.
 * @returns A new array of the shared suffix, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * getLongestCommonSuffix({ first: [1, 2, 3], second: [9, 2, 3] })
 */
export function getLongestCommonSuffix<Item>(
    params: GetLongestCommonSuffixParams<Item>,
): Item[] | undefined;
export function getLongestCommonSuffix(input: unknown): unknown[] | undefined;
export function getLongestCommonSuffix(input: unknown): unknown[] | undefined {
    const params = readParams<GetLongestCommonSuffixParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const first = readArray(params.first);
    const second = readArray(params.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    return commonSuffix(
        first,
        second,
        resolveEquals(params.equals as Equals<unknown> | undefined),
    );
}
