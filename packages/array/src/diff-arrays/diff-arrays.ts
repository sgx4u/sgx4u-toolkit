import type {
    ArrayMultisetDiff,
    DiffArraysParams,
} from "./diff-arrays.types.js";
import type { Equals } from "../types/equals.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the multiset difference of two arrays.
 *
 * `removed` holds items of `first` that were not matched in `second`.
 * `added` holds items of `second` that were not matched in `first`. One
 * match consumes one occurrence. Both lists keep appearance order.
 *
 * Either side not being an array returns `undefined`. The inputs are not
 * mutated.
 *
 * @param input - {@link DiffArraysParams}.
 * @returns `{ added, removed }`, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * diffArrays({ first: [1, 1, 2], second: [1, 3] })
 */
export function diffArrays<Item>(
    params: DiffArraysParams<Item>,
): ArrayMultisetDiff<Item> | undefined;
export function diffArrays(
    input: unknown,
): ArrayMultisetDiff<unknown> | undefined;
export function diffArrays(
    input: unknown,
): ArrayMultisetDiff<unknown> | undefined {
    const params = readParams<DiffArraysParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const first = readArray(params.first);
    const second = readArray(params.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    return multisetDiff(first, second, resolveEquals(params.equals));
}

/**
 * @param first - The previous array.
 * @param second - The next array.
 * @param equals - Item equality.
 * @returns Added and removed items, in appearance order.
 */
function multisetDiff(
    first: readonly unknown[],
    second: readonly unknown[],
    equals: Equals<unknown>,
): ArrayMultisetDiff<unknown> {
    const matched = new Array<boolean>(second.length).fill(false);
    const removed: unknown[] = [];
    for (let firstIndex = 0; firstIndex < first.length; firstIndex += 1) {
        const item = first[firstIndex] as unknown;
        const matchIndex = unmatchedIndex(second, matched, item, equals);
        if (matchIndex === undefined) {
            removed.push(item);
            continue;
        }
        matched[matchIndex] = true;
    }
    const added: unknown[] = [];
    for (let secondIndex = 0; secondIndex < second.length; secondIndex += 1) {
        if (!matched[secondIndex]) {
            added.push(second[secondIndex] as unknown);
        }
    }
    return { added, removed };
}

/**
 * @param array - The array being searched.
 * @param matched - Which indexes are already consumed.
 * @param item - The item to match.
 * @param equals - Item equality.
 * @returns The first unmatched equal index, or `undefined`.
 */
function unmatchedIndex(
    array: readonly unknown[],
    matched: readonly boolean[],
    item: unknown,
    equals: Equals<unknown>,
): number | undefined {
    for (let index = 0; index < array.length; index += 1) {
        if (matched[index]) {
            continue;
        }
        if (equals(array[index] as unknown, item)) {
            return index;
        }
    }
    return undefined;
}
