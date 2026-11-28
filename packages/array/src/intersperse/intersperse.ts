import type { IntersperseParams } from "./intersperse.types.js";
import { copyArray } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Inserts a separator between items and returns a new array.
 *
 * An empty array or a one-item array returns a shallow copy. The separator
 * is not added in those cases. The input is not mutated.
 *
 * @param params - The source array and the separator.
 * @returns The new array, or `undefined` when `array` is not an array.
 * @example
 * intersperse({ array: [1, 2, 3], separator: 0 });
 */
export function intersperse<Item, Separator = Item>(
    params: IntersperseParams<Item, Separator>,
): (Item | Separator)[] | undefined {
    const resolved = readParams<IntersperseParams<Item, Separator>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    if (array.length <= 1) {
        return copyArray(array);
    }
    return withSeparators(array, resolved.separator);
}

/**
 * Places `separator` between the items of `array`.
 *
 * @param array - A source array with at least two items.
 * @param separator - The value placed between items.
 * @returns A new array.
 */
function withSeparators<Item, Separator>(
    array: readonly Item[],
    separator: Separator,
): (Item | Separator)[] {
    const result: (Item | Separator)[] = [];
    for (let index = 0; index < array.length; index += 1) {
        if (index > 0) {
            result.push(separator);
        }
        result.push(array[index] as Item);
    }
    return result;
}
