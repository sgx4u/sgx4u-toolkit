import type { Equals } from "../types/equals.types.js";
import type { ReplaceItemParams } from "./replace-item.types.js";
import { copyArray } from "../utils/array.utils.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Replaces the first match, or every match, and returns a new array.
 *
 * Comparison is SameValueZero unless `equals` is set. `NaN` matches `NaN`
 * by default. No match returns a shallow copy. A present `equals` that is
 * not a function throws before the source array is read. The input is not
 * mutated.
 *
 * @param params - The source array, the item to find, and the replacement.
 * @returns The new array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * replaceItem({ array: [1, 2, 1], item: 1, replacement: 9, all: true });
 */
export function replaceItem<Item>(
    params: ReplaceItemParams<Item>,
): Item[] | undefined {
    const resolved = readParams<ReplaceItemParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (resolved.equals !== undefined) {
        resolveEquals(resolved.equals);
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return replaceMatches(
        array,
        resolved.item,
        resolved.replacement,
        resolveEquals(resolved.equals),
        resolved.all === true,
    );
}

/**
 * Copies `array`, replacing the first match or every match.
 *
 * @param array - The source array.
 * @param item - The item to find.
 * @param replacement - The value to write.
 * @param equals - Item equality.
 * @param all - Whether every match is replaced.
 * @returns The new array. A miss is a shallow copy.
 */
function replaceMatches<Item>(
    array: readonly Item[],
    item: Item,
    replacement: Item,
    equals: Equals<Item>,
    all: boolean,
): Item[] {
    const copy = copyArray(array);
    for (let index = 0; index < copy.length; index += 1) {
        if (!equals(copy[index] as Item, item)) {
            continue;
        }
        copy[index] = replacement;
        if (!all) {
            break;
        }
    }
    return copy;
}
