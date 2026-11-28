import { readItem } from "../utils/array.utils.js";
import { readArray } from "../utils/params.utils.js";

/**
 * Returns a new array without `null` and `undefined`.
 *
 * `0`, `false`, `""`, and `NaN` are kept. A hole is `undefined` and is
 * removed. The input is not mutated. A non-array returns `undefined`.
 * The result is a new array.
 *
 * @param array - The array to copy from. A non-array returns `undefined`.
 * @returns The kept items, or `undefined` when `array` is not an array.
 * @example
 * compactNullish([0, null, false, undefined, ""]);
 */
export function compactNullish<Item>(
    array: readonly Item[],
): Array<NonNullable<Item>> | undefined;
/**
 * @param array - A value that is not an array.
 * @returns `undefined` when `array` is not an array.
 */
export function compactNullish(
    array:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function compactNullish(
    array: unknown,
): Array<NonNullable<unknown>> | undefined {
    const items = readArray(array);
    if (items === undefined) {
        return undefined;
    }
    const result: Array<NonNullable<unknown>> = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = readItem(items, index);
        if (item !== null && item !== undefined) {
            result.push(item);
        }
    }
    return result;
}
