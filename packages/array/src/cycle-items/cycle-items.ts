import type { CycleItemsParams } from "./cycle-items.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Takes `count` items, wrapping to the start.
 *
 * An empty array returns `[]` for any valid `count`, including a count
 * greater than `0`. `count` is checked when the argument is a params
 * object, before `array` is read. A non-array `array` returns `undefined`.
 * A non-object argument returns `undefined`. The input is not mutated.
 *
 * @param params - The array and how many items to take.
 * @returns The cycled items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `count` is not a number.
 * @throws {@link RangeError} When `count` is negative, fractional, or not finite.
 * @example
 * cycleItems({ array: [1, 2, 3], count: 5 });
 */
export function cycleItems<Item>(
    params: CycleItemsParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function cycleItems(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function cycleItems(params: unknown): unknown[] | undefined {
    const resolved = readParams<CycleItemsParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const count = assertNonNegativeInteger("count", resolved.count);
    const array = readArray(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return takeCycled(array, count);
}

/**
 * @param array - The source array.
 * @param count - How many items to take.
 * @returns A new dense array. An empty source yields `[]`.
 */
function takeCycled(array: readonly unknown[], count: number): unknown[] {
    if (array.length === 0 || count === 0) {
        return [];
    }
    const result: unknown[] = [];
    for (let index = 0; index < count; index += 1) {
        result.push(readItem(array, index % array.length));
    }
    return result;
}
