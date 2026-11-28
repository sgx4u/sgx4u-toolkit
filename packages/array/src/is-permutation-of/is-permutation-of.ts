import type { Equals } from "../types/equals.types.js";
import type { IsPermutationOfParams } from "./is-permutation-of.types.js";
import { sameValueZero } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Reports whether two arrays hold the same items with the same multiplicities.
 *
 * Order does not matter. `[1, 2, 2]` is a permutation of `[2, 1, 2]`, and
 * it is not a permutation of `[1, 2]`. `NaN` equals `NaN` by default. The
 * function never throws. A non-array, or an `equals` that is not a function,
 * returns `false`.
 *
 * @param params - `array`, `other`, and an optional `equals`.
 * @returns `true` when the multisets match.
 * @example
 * isPermutationOf({ array: [1, 2, 1], other: [1, 1, 2] })
 */
export function isPermutationOf<Item>(
    params: IsPermutationOfParams<Item>,
): boolean;
export function isPermutationOf(params: unknown): boolean;
export function isPermutationOf(params: unknown): boolean {
    const resolved = readParams<IsPermutationOfParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const equals = readEquals<unknown>(resolved.equals);
    const array = readArray<unknown>(resolved.array);
    const other = readArray<unknown>(resolved.other);
    if (equals === undefined || array === undefined || other === undefined) {
        return false;
    }
    if (array.length !== other.length) {
        return false;
    }
    if (equals === (sameValueZero as Equals<unknown>)) {
        return sameCounts(array, other);
    }
    return sameCountsWithEquals(array, other, equals);
}

/**
 * Compares multiplicities with a `Map`, which uses SameValueZero.
 *
 * @param array - The first array.
 * @param other - The second array.
 * @returns `true` when the counts match.
 */
function sameCounts(
    array: readonly unknown[],
    other: readonly unknown[],
): boolean {
    const counts = new Map<unknown, number>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as unknown;
        counts.set(item, (counts.get(item) ?? 0) + 1);
    }
    for (let index = 0; index < other.length; index += 1) {
        const item = other[index] as unknown;
        const count = counts.get(item);
        if (count === undefined) {
            return false;
        }
        if (count === 1) {
            counts.delete(item);
            continue;
        }
        counts.set(item, count - 1);
    }
    return counts.size === 0;
}

/**
 * Compares multiplicities with a custom equality function.
 *
 * The copy of `other` is local. The input arrays are not mutated.
 *
 * @param array - The first array.
 * @param other - The second array.
 * @param equals - Item equality.
 * @returns `true` when the counts match.
 */
function sameCountsWithEquals(
    array: readonly unknown[],
    other: readonly unknown[],
    equals: Equals<unknown>,
): boolean {
    const unmatched = other.slice();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as unknown;
        const matchIndex = unmatched.findIndex((candidate) =>
            equals(candidate, item),
        );
        if (matchIndex < 0) {
            return false;
        }
        unmatched.splice(matchIndex, 1);
    }
    return unmatched.length === 0;
}

/**
 * Reads `equals` without throwing.
 *
 * @param equals - The candidate comparer.
 * @returns The comparer, or `undefined` when it is not a function.
 */
function readEquals<Item>(equals: unknown): Equals<Item> | undefined {
    if (equals === undefined) {
        return sameValueZero as Equals<Item>;
    }
    if (typeof equals !== "function") {
        return undefined;
    }
    return equals as Equals<Item>;
}
