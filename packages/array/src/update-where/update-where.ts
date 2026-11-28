import type { Predicate } from "../types/iteratee.types.js";
import type { UpdateWhereParams } from "./update-where.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertFunction, assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Updates the first matching item, or every match, and returns a new array.
 *
 * `all` defaults to false. When nothing matches, the result is a shallow
 * copy. `updater` is a function `(item, index) => item`. A present predicate
 * or updater that is not a function throws before the source array is read.
 * The input is not mutated.
 *
 * @param params - The source array, the predicate, and the updater.
 * @returns The new array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` or `updater` is present and is not a function, or when a real array omits either one.
 * @example
 * updateWhere({
 *     array: [1, 2, 3],
 *     predicate: (item) => item > 1,
 *     updater: (item) => item * 10,
 * });
 */
export function updateWhere<Item>(
    params: UpdateWhereParams<Item>,
): Item[] | undefined {
    const resolved = readParams<UpdateWhereParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const predicate = assertPredicate<Item>("predicate", resolved.predicate);
    const updater = assertUpdater<Item>(resolved.updater);
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return replaceMatches(array, predicate, updater, resolved.all === true);
}

/**
 * Checks that `updater` is a function.
 *
 * @param updater - The candidate updater.
 * @returns The updater.
 * @throws {@link TypeError} When `updater` is not a function.
 */
function assertUpdater<Item>(
    updater: unknown,
): (item: Item, index: number) => Item {
    assertFunction("updater", updater);
    return updater as (item: Item, index: number) => Item;
}

/**
 * Copies `array`, replacing the first match or every match.
 *
 * @param array - The source array.
 * @param predicate - Selects items to update.
 * @param updater - Returns the replacement.
 * @param all - Whether every match is updated.
 * @returns The new array. A miss is a shallow copy.
 */
function replaceMatches<Item>(
    array: readonly Item[],
    predicate: Predicate<Item>,
    updater: (item: Item, index: number) => Item,
    all: boolean,
): Item[] {
    const copy = copyArray(array);
    for (let index = 0; index < copy.length; index += 1) {
        const item = copy[index] as Item;
        if (!predicate(item, index, copy)) {
            continue;
        }
        copy[index] = updater(item, index);
        if (!all) {
            break;
        }
    }
    return copy;
}
