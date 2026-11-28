import type { SplitWhenParams } from "./split-when.types.js";
import { copyArray, readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Splits an array at the first item that satisfies `predicate`.
 *
 * That item starts the right side. When no item matches, the right side
 * is a new empty array and the left side is a dense copy. Both sides are
 * new arrays. Holes become `undefined`. The input is not mutated. When
 * the argument is a params object, `predicate` is checked before `array`.
 * A non-object argument returns `undefined`. A non-array `array` returns
 * `undefined`.
 *
 * @param params - `array` and `predicate`.
 * @returns A pair of new arrays, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * splitWhen({ array: [1, 2, 3, 4], predicate: (item) => item > 2 });
 */
export function splitWhen<Item>(
    params: SplitWhenParams<Item>,
): [Item[], Item[]] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function splitWhen(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function splitWhen(params: unknown): [unknown[], unknown[]] | undefined {
    const parsed = readParams<SplitWhenParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const predicate = assertPredicate("predicate", parsed.predicate);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    let splitIndex = array.length;
    for (let index = 0; index < array.length; index += 1) {
        if (predicate(readItem(array, index), index, array)) {
            splitIndex = index;
            break;
        }
    }
    const copy = copyArray(array);
    return [copy.slice(0, splitIndex), copy.slice(splitIndex)];
}
