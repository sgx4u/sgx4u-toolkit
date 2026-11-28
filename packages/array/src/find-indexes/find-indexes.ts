import type { FindIndexesParams } from "./find-indexes.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns every index whose item satisfies `predicate`, in order.
 *
 * An empty array, and an array with no match, return a new empty array.
 * A hole is passed to `predicate` as `undefined`. The array is not
 * mutated. When the argument is a params object, `predicate` is checked
 * before `array`, so a bad predicate throws even when `array` is not an
 * array. A non-object argument returns `undefined`. A non-array `array`
 * returns `undefined` after `predicate` has been checked.
 *
 * @param params - `array` and `predicate`.
 * @returns The matching indexes, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * findIndexes({ array: [1, 2, 1], predicate: (item) => item === 1 });
 */
export function findIndexes<Item>(
    params: FindIndexesParams<Item>,
): number[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function findIndexes(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function findIndexes(params: unknown): number[] | undefined {
    const parsed = readParams<FindIndexesParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const predicate = assertPredicate("predicate", parsed.predicate);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const indexes: number[] = [];
    for (let index = 0; index < array.length; index += 1) {
        if (predicate(readItem(array, index), index, array)) {
            indexes.push(index);
        }
    }
    return indexes;
}
